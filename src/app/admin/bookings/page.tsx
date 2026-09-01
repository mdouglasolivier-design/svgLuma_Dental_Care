"use client";

import { useEffect, useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";

export default function AdminBookings() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    doctorId: "",
    locationId: "",
  });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/appointments").then((r) => r.json()).then(setAppointments);
    fetch("/api/doctors").then((r) => r.json()).then(setDoctors);
    fetch("/api/locations").then((r) => r.json()).then(setLocations);
  }, []);

  const filtered = appointments.filter((a) => {
    if (filters.status && a.status !== filters.status) return false;
    if (filters.doctorId && a.doctorId !== filters.doctorId) return false;
    if (filters.locationId && a.locationId !== filters.locationId) return false;
    return true;
  });

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
      <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
        <select
          value={filters.doctorId}
          onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={filters.locationId}
          onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-medium text-slate-600">Patient</th>
              <th className="text-left p-3 font-medium text-slate-600">Doctor</th>
              <th className="text-left p-3 font-medium text-slate-600">Service</th>
              <th className="text-left p-3 font-medium text-slate-600">Location</th>
              <th className="text-left p-3 font-medium text-slate-600">Date</th>
              <th className="text-left p-3 font-medium text-slate-600">Time</th>
              <th className="text-left p-3 font-medium text-slate-600">Status</th>
              <th className="text-left p-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{apt.patient?.user?.name}</td>
                <td className="p-3 text-slate-600">{apt.doctor?.user?.name}</td>
                <td className="p-3 text-slate-600">{apt.service?.name}</td>
                <td className="p-3 text-slate-600">{apt.location?.name}</td>
                <td className="p-3 text-slate-600">{apt.date}</td>
                <td className="p-3 text-slate-600">{apt.time}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    apt.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                    apt.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                    apt.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                    apt.status === "NO_SHOW" ? "bg-red-50 text-red-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {apt.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatus(apt.id, e.target.value)}
                    className="border border-slate-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No appointments match the filters
          </div>
        )}
      </div>
    </div>
  );
}
