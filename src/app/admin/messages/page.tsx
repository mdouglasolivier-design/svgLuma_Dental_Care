"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Clock, CheckCircle2, Archive } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contact").then((r) => r.json()).then(setMessages);
  }, []);

  const handleStatus = async (id: string, status: string) => {
    // In a real app this would PATCH the message status
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Messages</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                  selected?.id === msg.id ? "bg-teal-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">
                      {msg.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {msg.message}
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                    msg.status === "NEW" ? "bg-blue-500" : "bg-slate-300"
                  }`} />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
            {messages.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No messages
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selected.name}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {selected.email}
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {selected.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selected.status === "NEW"
                    ? "bg-blue-50 text-blue-700"
                    : selected.status === "RESPONDED"
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {selected.status}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
                {selected.message}
              </div>

              <div className="mt-4 flex gap-2">
                {selected.status !== "RESPONDED" && (
                  <button
                    onClick={() => handleStatus(selected.id, "RESPONDED")}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Responded
                  </button>
                )}
                <button
                  onClick={() => handleStatus(selected.id, "ARCHIVED")}
                  className="flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Archive className="w-4 h-4" /> Archive
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
