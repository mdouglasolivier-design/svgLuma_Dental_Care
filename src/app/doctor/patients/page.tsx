"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Calendar, FileText } from "lucide-react";

export default function DoctorPatients() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const doctorId = (session?.user as any)?.doctorId;
    if (doctorId) {
      fetch(`/api/appointments?doctorId=${doctorId}`)
        .then((r) => r.json())
        .then(setAppointments);
    }
  }, [session]);

  // Get unique patients from appointments
  const uniquePatients = Array.from(
    new Map(
      appointments.map((a) => [a.patientId, a.patient])
    ).values()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">My Patients</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {uniquePatients.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                  selectedPatient?.id === p.id ? "bg-teal-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-900">{p.user?.name}</div>
                    <div className="text-xs text-slate-500">{p.user?.email}</div>
                  </div>
                </div>
              </button>
            ))}
            {uniquePatients.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No patients yet
              </div>
            )}
          </div>
        </div>

        {/* Patient Detail */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedPatient.user?.name}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedPatient.user?.email}</p>
                  <p className="text-sm text-slate-500">{selectedPatient.user?.phone}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Date of Birth</div>
                  <div className="text-sm font-medium">{selectedPatient.dateOfBirth || "—"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Insurance</div>
                  <div className="text-sm font-medium">{selectedPatient.insurance || "—"}</div>
                </div>
              </div>

              <h4 className="font-semibold text-slate-900 mb-3">Appointment History</h4>
              <div className="space-y-2">
                {appointments
                  .filter((a) => a.patientId === selectedPatient.id)
                  .map((apt) => (
                    <div key={apt.id} className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{apt.service?.name}</div>
                        <div className="text-xs text-slate-500">{apt.date} at {apt.time}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        apt.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {apt.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
