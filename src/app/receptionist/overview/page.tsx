"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  reason: string | null;
  patient: {
    user: { name: string; email: string; phone: string | null };
    insurance: string | null;
  };
  doctor: {
    user: { name: string };
    specialty: string;
  };
  service: { name: string };
  location: { name: string };
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function ReceptionistOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/appointments").then((r) => r.json()),
      fetch("/api/contact-messages").then((r) => r.json()),
    ])
      .then(([appts, msgs]) => {
        setAppointments(Array.isArray(appts) ? appts : []);
        setMessages(Array.isArray(msgs) ? msgs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today);
  const pendingAppts = appointments.filter((a) => a.status === "PENDING");
  const newMessages = messages.filter((m) => m.status === "NEW");
  const totalPatients = new Set(appointments.map((a) => a.patient.user.email)).size;

  const stats = [
    {
      icon: <Calendar className="w-5 h-5 text-teal-600" />,
      bg: "bg-teal-50",
      label: "Today's Appointments",
      value: todayAppts.length,
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
      label: "Pending Confirmation",
      value: pendingAppts.length,
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      label: "New Queries",
      value: newMessages.length,
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      label: "Unique Patients",
      value: totalPatients,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Reception Overview</h2>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                {s.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Today&apos;s Appointments</h3>
          {todayAppts.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayAppts.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-700">
                    {a.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {a.patient.user.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {a.service.name} with Dr. {a.doctor.user.name.split(" ").pop()}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    a.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                    a.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                    a.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patient Queries */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Patient Queries</h3>
          {newMessages.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No new queries.</p>
          ) : (
            <div className="space-y-3">
              {newMessages.slice(0, 5).map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{m.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{m.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {m.phone && <span className="text-xs text-slate-500">{m.phone}</span>}
                    <span className="text-xs text-slate-500">{m.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insurance Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Patients with Insurance Info</h3>
        {appointments.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No appointment data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-600">Patient</th>
                  <th className="text-left p-3 font-medium text-slate-600">Phone</th>
                  <th className="text-left p-3 font-medium text-slate-600">Email</th>
                  <th className="text-left p-3 font-medium text-slate-600">Insurance</th>
                  <th className="text-left p-3 font-medium text-slate-600">Next Visit</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const seen = new Set<string>();
                  const rows: Appointment[] = [];
                  for (const a of appointments) {
                    const key = a.patient.user.email;
                    if (!seen.has(key)) {
                      seen.add(key);
                      rows.push(a);
                    }
                  }
                  return rows.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-900">{a.patient.user.name}</td>
                      <td className="p-3 text-slate-600">{a.patient.user.phone || "—"}</td>
                      <td className="p-3 text-slate-600">{a.patient.user.email}</td>
                      <td className="p-3">
                        {a.patient.insurance ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {a.patient.insurance}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">No insurance</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">{a.date} at {a.time}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
