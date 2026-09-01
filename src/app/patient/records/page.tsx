"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FileText, Calendar, User } from "lucide-react";

export default function PatientRecords() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const patientId = (session?.user as any)?.patientId;
    if (patientId) {
      fetch(`/api/treatment-records?patientId=${patientId}`)
        .then((r) => r.json())
        .then(setRecords)
        .catch(() => setRecords([]));
    }
  }, [session]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Treatment Records</h2>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No treatment records yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Records will appear here after your appointments
            </p>
          </div>
        ) : (
          records.map((r) => (
            <div key={r.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{r.description}</div>
                  <div className="mt-1 flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {r.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {r.doctor?.user?.name}
                    </span>
                  </div>
                  {r.notes && (
                    <p className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                      {r.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
