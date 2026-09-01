"use client";

import { useEffect, useState } from "react";
import { Activity, UserPlus, LogIn, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityEntry {
  id: string;
  type: string;
  userId: string | null;
  email: string;
  name: string | null;
  role: string | null;
  details: string | null;
  createdAt: string;
}

interface ActivityStats {
  LOGIN: number;
  LOGOUT: number;
  REGISTRATION: number;
  APPOINTMENT_BOOKED: number;
  [key: string]: number;
}

const typeLabels: Record<string, string> = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  REGISTRATION: "Registration",
  APPOINTMENT_BOOKED: "Appointment Booked",
};

const typeColors: Record<string, string> = {
  LOGIN: "bg-blue-50 text-blue-700 border-blue-200",
  LOGOUT: "bg-slate-50 text-slate-600 border-slate-200",
  REGISTRATION: "bg-green-50 text-green-700 border-green-200",
  APPOINTMENT_BOOKED: "bg-purple-50 text-purple-700 border-purple-200",
};

const typeIcons: Record<string, typeof LogIn> = {
  LOGIN: LogIn,
  REGISTRATION: UserPlus,
  APPOINTMENT_BOOKED: Calendar,
};

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [stats, setStats] = useState<ActivityStats>({ LOGIN: 0, LOGOUT: 0, REGISTRATION: 0, APPOINTMENT_BOOKED: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p: number, type: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "50" });
    if (type) params.set("type", type);
    const res = await fetch(`/api/admin/activity-log?${params}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setStats(data.stats || {});
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(page, filterType);
  }, [page, filterType]);

  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Activity Log</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track logins, account registrations, and appointment bookings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => { setFilterType(""); setPage(1); }}
          className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${!filterType ? "border-teal-400 ring-2 ring-teal-100" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
              <p className="text-xs text-slate-500">Total Activities</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => { setFilterType("LOGIN"); setPage(1); }}
          className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${filterType === "LOGIN" ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <LogIn className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.LOGIN || 0}</p>
              <p className="text-xs text-slate-500">Logins</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => { setFilterType("REGISTRATION"); setPage(1); }}
          className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${filterType === "REGISTRATION" ? "border-green-400 ring-2 ring-green-100" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.REGISTRATION || 0}</p>
              <p className="text-xs text-slate-500">Registrations</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => { setFilterType("APPOINTMENT_BOOKED"); setPage(1); }}
          className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${filterType === "APPOINTMENT_BOOKED" ? "border-purple-400 ring-2 ring-purple-100" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.APPOINTMENT_BOOKED || 0}</p>
              <p className="text-xs text-slate-500">Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All", value: "" },
          { label: "Logins", value: "LOGIN" },
          { label: "Registrations", value: "REGISTRATION" },
          { label: "Appointments", value: "APPOINTMENT_BOOKED" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setFilterType(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterType === tab.value
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading activity...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No activity recorded yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Details</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => {
                    const Icon = typeIcons[log.type] || Activity;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeColors[log.type] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                            <Icon className="w-3 h-3" />
                            {typeLabels[log.type] || log.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{log.name || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{log.email}</td>
                        <td className="px-4 py-3 text-slate-600">{log.role || "—"}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                          {log.details || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          <span title={formatTime(log.createdAt)}>{timeAgo(log.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">
                {total} total activities
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
