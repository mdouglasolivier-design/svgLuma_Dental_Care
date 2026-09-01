"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PatientOverview() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const patientId = (session?.user as any)?.patientId;
    if (patientId) {
      fetch(`/api/appointments?patientId=${patientId}`)
        .then((r) => r.json())
        .then(setAppointments);
    }
  }, [session]);

  const upcoming = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );
  const nextAppointment = upcoming[0];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        Welcome back, {session?.user?.name?.split(" ")[0]}!
      </h2>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/booking"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900 text-sm">Book New Visit</div>
            <div className="text-xs text-slate-500">Schedule an appointment</div>
          </div>
        </Link>
        <Link
          href="/patient/messages"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900 text-sm">Message Clinic</div>
            <div className="text-xs text-slate-500">Send a message</div>
          </div>
        </Link>
        <Link
          href="/patient/records"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900 text-sm">View Records</div>
            <div className="text-xs text-slate-500">Treatment history</div>
          </div>
        </Link>
      </div>

      {/* Next Appointment */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Upcoming Appointment</h3>
        {nextAppointment ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">
                {nextAppointment.service?.name}
              </div>
              <div className="text-sm text-slate-500">
                with {nextAppointment.doctor?.user?.name} at{" "}
                {nextAppointment.location?.name}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-slate-900">{nextAppointment.date}</div>
              <div className="text-sm text-slate-500">{nextAppointment.time}</div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              nextAppointment.status === "CONFIRMED"
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              {nextAppointment.status}
            </span>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No upcoming appointments</p>
            <Link
              href="/booking"
              className="mt-2 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Book your first visit →
            </Link>
          </div>
        )}
      </div>

      {/* All Appointments */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Appointments</h3>
          <Link href="/patient/appointments" className="text-sm text-teal-600 hover:text-teal-700">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.slice(0, 5).map((apt) => (
            <div key={apt.id} className="p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${
                apt.status === "COMPLETED" ? "bg-green-500" :
                apt.status === "CONFIRMED" ? "bg-blue-500" :
                apt.status === "CANCELLED" ? "bg-red-500" :
                "bg-amber-500"
              }`} />
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-900">{apt.service?.name}</div>
                <div className="text-xs text-slate-500">
                  {apt.doctor?.user?.name} · {apt.date}
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                apt.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                apt.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                apt.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                {apt.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No appointments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
