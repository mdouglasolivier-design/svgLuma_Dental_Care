"use client";

import { useEffect, useState } from "react";
import { User, Star, Edit2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminStaff() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/doctors").then((r) => r.json()).then(setDoctors);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Staff Directory</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          + Add Staff Member
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{doc.name}</h3>
                <p className="text-sm text-teal-600">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-slate-600">{doc.rating}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{doc.email}</p>
              </div>
            </div>
            {doc.bio && (
              <p className="mt-3 text-sm text-slate-500 line-clamp-2">{doc.bio}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-teal-600 font-medium px-2 py-1 rounded border border-slate-200">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 font-medium px-2 py-1 rounded border border-slate-200">
                <ToggleLeft className="w-3 h-3" /> Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
