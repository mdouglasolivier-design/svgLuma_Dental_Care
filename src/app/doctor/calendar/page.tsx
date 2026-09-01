"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

export default function DoctorCalendar() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");

  useEffect(() => {
    const doctorId = (session?.user as any)?.doctorId;
    if (doctorId) {
      fetch(`/api/appointments?doctorId=${doctorId}`)
        .then((r) => r.json())
        .then(setAppointments);
    }
  }, [session]);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const getApptsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((a) => a.date === dateStr);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                view === "week" ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                view === "month" ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              Month
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevWeek} className="p-1 hover:bg-slate-100 rounded">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-900 min-w-[160px] text-center">
              {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
              {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button onClick={nextWeek} className="p-1 hover:bg-slate-100 rounded">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {view === "week" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200">
            {weekDays.map((d) => {
              const isToday = d.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={d.toISOString()}
                  className={`p-3 text-center ${isToday ? "bg-teal-50" : ""}`}
                >
                  <div className="text-xs text-slate-500 uppercase">
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? "text-teal-600" : "text-slate-900"}`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDays.map((d) => {
              const dayAppts = getApptsForDate(d);
              const isToday = d.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={d.toISOString()}
                  className={`border-r border-slate-100 last:border-r-0 p-2 ${isToday ? "bg-teal-50/30" : ""}`}
                >
                  {dayAppts.map((apt) => (
                    <div
                      key={apt.id}
                      className={`p-2 rounded-lg text-xs mb-1 ${
                        apt.status === "COMPLETED"
                          ? "bg-green-50 border border-green-200"
                          : apt.status === "CONFIRMED"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-amber-50 border border-amber-200"
                      }`}
                    >
                      <div className="font-medium">{apt.time}</div>
                      <div className="text-slate-600 truncate">{apt.patient?.user?.name}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {view === "month" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-slate-500 p-2">
                {d}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1);
              const dayAppts = getApptsForDate(d);
              const isCurrentMonth = d.getMonth() === currentDate.getMonth();
              const isToday = d.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-1 rounded-lg border border-slate-100 ${
                    isCurrentMonth ? "" : "opacity-40"
                  } ${isToday ? "bg-teal-50 border-teal-200" : ""}`}
                >
                  <div className={`text-xs font-medium mb-1 ${
                    isToday ? "text-teal-600" : "text-slate-700"
                  }`}>
                    {d.getDate()}
                  </div>
                  {dayAppts.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="text-[10px] bg-teal-100 text-teal-800 rounded px-1 py-0.5 mb-0.5 truncate"
                    >
                      {apt.time} {apt.patient?.user?.name?.split(" ")[0]}
                    </div>
                  ))}
                  {dayAppts.length > 2 && (
                    <div className="text-[10px] text-slate-500">+{dayAppts.length - 2} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
