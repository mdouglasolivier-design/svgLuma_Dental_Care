"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Clock, User, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function DoctorSchedule() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const doctorId = (session?.user as any)?.doctorId;
    if (doctorId) {
      fetch(`/api/appointments?doctorId=${doctorId}`)
        .then((r) => r.json())
        .then(setAppointments);
    }
  }, [session]);

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today);
  const completed = todayAppts.filter((a) => a.status === "COMPLETED").length;
  const pending = todayAppts.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length;
  const noShows = todayAppts.filter((a) => a.status === "NO_SHOW").length;

  const handleStatus = async (id: string, status: string) => {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Today&apos;s Schedule</h2>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Patients Today</div>
          <div className="text-2xl font-bold text-slate-900">{todayAppts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Completed</div>
          <div className="text-2xl font-bold text-green-600">{completed}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">No-Shows</div>
          <div className="text-2xl font-bold text-red-600">{noShows}</div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Appointments ({todayAppts.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {todayAppts.map((apt) => (
            <div key={apt.id} className="p-4 flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <div className="text-lg font-bold text-slate-900">{apt.time}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900">
                  {apt.patient?.user?.name}
                </div>
                <div className="text-sm text-slate-500">
                  {apt.service?.name} · {apt.location?.name}
                </div>
                {apt.reason && (
                  <div className="text-xs text-slate-400 mt-1">{apt.reason}</div>
                )}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                apt.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                apt.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                apt.status === "NO_SHOW" ? "bg-red-50 text-red-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                {apt.status.replace("_", " ")}
              </span>
              <div className="flex gap-1">
                {apt.status !== "COMPLETED" && apt.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleStatus(apt.id, "COMPLETED")}
                    className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1"
                  >
                    Complete
                  </button>
                )}
                {apt.status !== "NO_SHOW" && apt.status !== "COMPLETED" && apt.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleStatus(apt.id, "NO_SHOW")}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
                  >
                    No Show
                  </button>
                )}
              </div>
            </div>
          ))}
          {todayAppts.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No appointments scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
