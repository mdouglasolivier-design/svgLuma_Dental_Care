"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ListChecks, Clock, User } from "lucide-react";

export default function DoctorQueue() {
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

  const queue = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );

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
      <h2 className="text-2xl font-bold text-slate-900">Patient Queue</h2>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Waiting / In Progress ({queue.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {queue.map((apt) => (
            <div key={apt.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">
                  {apt.patient?.user?.name}
                </div>
                <div className="text-sm text-slate-500">
                  {apt.service?.name} · {apt.date} at {apt.time}
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                apt.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                {apt.status}
              </span>
              <button
                onClick={() => handleStatus(apt.id, "COMPLETED")}
                className="text-sm bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Complete
              </button>
            </div>
          ))}
          {queue.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No patients in queue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
