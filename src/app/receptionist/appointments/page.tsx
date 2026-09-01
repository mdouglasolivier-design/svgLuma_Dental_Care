"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  reason: string | null;
  notes: string | null;
  createdAt: string;
  patient: {
    user: { name: string; email: string; phone: string | null };
    insurance: string | null;
    dateOfBirth: string | null;
  };
  doctor: {
    user: { name: string };
    specialty: string;
  };
  service: { name: string; duration: number };
  location: { name: string };
};

export default function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);

  const fetchAppointments = () => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : null));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      !search ||
      a.patient.user.name.toLowerCase().includes(search.toLowerCase()) ||
      a.patient.user.email.toLowerCase().includes(search.toLowerCase()) ||
      a.service.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.user.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let matchDateRange = true;
    if (dateRange === "TODAY") {
      matchDateRange = a.date === todayStr;
    } else if (dateRange === "THIS_WEEK") {
      const d = new Date(a.date);
      matchDateRange = d >= weekStart && d <= weekEnd;
    } else if (dateRange === "THIS_MONTH") {
      const d = new Date(a.date);
      matchDateRange = d >= monthStart && d <= monthEnd;
    } else if (dateFilter) {
      matchDateRange = a.date === dateFilter;
    }
    return matchSearch && matchStatus && matchDateRange;
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-green-50 text-green-700",
    COMPLETED: "bg-blue-50 text-blue-700",
    CANCELLED: "bg-red-50 text-red-700",
    NO_SHOW: "bg-slate-100 text-slate-600",
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
        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
        <span className="text-sm text-slate-500">{filtered.length} total</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        {/* Date Range Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Show:</span>
          {[{ label: "All", value: "ALL" }, { label: "Today", value: "TODAY" }, { label: "This Week", value: "THIS_WEEK" }, { label: "This Month", value: "THIS_MONTH" }].map((r) => (
            <button
              key={r.value}
              onClick={() => { setDateRange(r.value); if (r.value !== "ALL") setDateFilter(""); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dateRange === r.value
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.label}
            </button>
          ))}
          {dateRange === "ALL" && (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          {(dateRange !== "ALL" || dateFilter) && (
            <button
              onClick={() => { setDateRange("ALL"); setDateFilter(""); }}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, or service..."
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
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No appointments found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                    selected?.id === a.id ? "bg-teal-50 border-l-4 border-teal-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 text-sm">
                      {a.patient.user.name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[a.status] || "bg-slate-100 text-slate-600"}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {a.date} at {a.time} — {a.service.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Dr. {a.doctor.user.name} · {a.location.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Appointment Detail */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Appointment Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 text-xs">Patient</span>
                  <p className="font-medium text-slate-900">{selected.patient.user.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Email</span>
                  <p className="text-slate-700">{selected.patient.user.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Phone</span>
                  <p className="text-slate-700">{selected.patient.user.phone || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Date of Birth</span>
                  <p className="text-slate-700">{selected.patient.dateOfBirth || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Insurance</span>
                  {selected.patient.insurance ? (
                    <p className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {selected.patient.insurance}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-xs">No insurance on file</p>
                  )}
                </div>
                <hr className="border-slate-200" />
                <div>
                  <span className="text-slate-500 text-xs">Service</span>
                  <p className="font-medium text-slate-900">{selected.service.name} ({selected.service.duration} min)</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Doctor</span>
                  <p className="text-slate-700">Dr. {selected.doctor.user.name} — {selected.doctor.specialty}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Date & Time</span>
                  <p className="text-slate-700">{selected.date} at {selected.time}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Location</span>
                  <p className="text-slate-700">{selected.location.name}</p>
                </div>
                {selected.reason && (
                  <div>
                    <span className="text-slate-500 text-xs">Reason for Visit</span>
                    <p className="text-slate-700">{selected.reason}</p>
                  </div>
                )}
                <hr className="border-slate-200" />
                <div>
                  <span className="text-slate-500 text-xs mb-2 block">Update Status</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateStatus(selected.id, "CONFIRMED")}
                      className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, "CANCELLED")}
                      className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, "COMPLETED")}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, "NO_SHOW")}
                      className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> No Show
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">Select an appointment to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
