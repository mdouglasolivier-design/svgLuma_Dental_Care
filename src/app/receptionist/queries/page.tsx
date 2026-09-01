"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Archive,
  Search,
} from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function ReceptionistQueries() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = () => {
    fetch("/api/contact-messages")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : null));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const filtered = messages.filter((m) => {
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700",
    RESPONDED: "bg-green-50 text-green-700",
    ARCHIVED: "bg-slate-100 text-slate-600",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    NEW: <Clock className="w-3 h-3" />,
    RESPONDED: <CheckCircle2 className="w-3 h-3" />,
    ARCHIVED: <Archive className="w-3 h-3" />,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Patient Queries</h2>
        <span className="text-sm text-slate-500">{filtered.length} total</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="RESPONDED">Responded</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No queries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                    selected?.id === m.id ? "bg-teal-50 border-l-4 border-teal-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 text-sm">{m.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${statusColors[m.status] || "bg-slate-100 text-slate-600"}`}>
                      {statusIcons[m.status]}
                      {m.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-1">{m.message}</p>
                  <div className="text-xs text-slate-400">
                    {m.email} · {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Query Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 text-xs">From</span>
                  <p className="font-medium text-slate-900">{selected.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Email</span>
                  <p className="text-slate-700 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {selected.email}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Phone</span>
                  <p className="text-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selected.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Received</span>
                  <p className="text-slate-700">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <hr className="border-slate-200" />
                <div>
                  <span className="text-slate-500 text-xs">Message</span>
                  <p className="text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
                <hr className="border-slate-200" />
                <div>
                  <span className="text-slate-500 text-xs mb-2 block">Update Status</span>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateStatus(selected.id, "RESPONDED")}
                      className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark as Responded
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, "ARCHIVED")}
                      className="w-full px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Archive className="w-3 h-3" /> Archive
                    </button>
                    <a
                      href={`mailto:${selected.email}?subject=Re: Your inquiry to Luma Dental Care`}
                      className="w-full px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3" /> Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
