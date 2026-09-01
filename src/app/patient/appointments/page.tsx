"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function PatientAppointments() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const patientId = (session?.user as any)?.patientId;
    if (patientId) {
      fetch(`/api/appointments?patientId=${patientId}`)
        .then((r) => r.json())
        .then(setAppointments);
    }
  }, [session]);

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter.toUpperCase());

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "CANCELLED" }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
        <div className="flex gap-2">
          {["all", "upcoming", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {filtered.map((apt) => (
          <div key={apt.id} className="p-4 lg:p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{apt.service?.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  apt.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                  apt.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                  apt.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {apt.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {apt.doctor?.user?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {apt.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {apt.location?.name}
                </span>
              </div>
              {apt.reason && (
                <p className="mt-2 text-sm text-slate-500">{apt.reason}</p>
              )}
            </div>
            {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
              <div className="flex gap-2">
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
}
