"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsThisWeek: 0,
    revenue: 0,
    satisfactionRate: 98,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([data]) => {
      setStats(data);
    }).catch(() => {});
  }, []);

  const kpis = [
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      label: "Total Patients",
      value: stats.totalPatients,
      change: "+12%",
      changeUp: true,
    },
    {
      icon: <Calendar className="w-5 h-5 text-teal-600" />,
      bg: "bg-teal-50",
      label: "Appointments This Week",
      value: stats.appointmentsThisWeek,
      change: "+8%",
      changeUp: true,
    },
    {
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      label: "Revenue (This Month)",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+15%",
      changeUp: true,
    },
    {
      icon: <Star className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
      label: "Satisfaction Rate",
      value: `${stats.satisfactionRate}%`,
      change: "+2%",
      changeUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                {kpi.icon}
              </div>
              <span className={`text-xs font-medium ${kpi.changeUp ? "text-green-600" : "text-red-600"}`}>
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
            <div className="text-sm text-slate-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[
              { name: "John Smith", service: "Preventive Care", time: "2h ago" },
              { name: "Jane Doe", service: "Teeth Whitening", time: "4h ago" },
              { name: "Robert Williams", service: "Dental Implants", time: "1d ago" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                  {b.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-500">{b.service}</div>
                </div>
                <span className="text-xs text-slate-400">{b.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "View All Bookings", href: "/admin/bookings", color: "bg-teal-50 text-teal-700" },
              { label: "Manage Staff", href: "/admin/staff", color: "bg-blue-50 text-blue-700" },
              { label: "Manage Services", href: "/admin/services", color: "bg-purple-50 text-purple-700" },
              { label: "View Messages", href: "/admin/messages", color: "bg-amber-50 text-amber-700" },
            ].map((a) => (
              <a
                key={a.label}
                href={a.href}
                className={`p-4 rounded-xl ${a.color} font-medium text-sm hover:opacity-80 transition-opacity`}
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
