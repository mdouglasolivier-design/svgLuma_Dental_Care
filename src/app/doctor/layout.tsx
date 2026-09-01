"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  Clock,
  ListChecks,
  BarChart3,
  CalendarDays,
  Users,
} from "lucide-react";

const menuItems = [
  { href: "/doctor/schedule", label: "Today's Schedule", icon: <Clock className="w-5 h-5" /> },
  { href: "/doctor/queue", label: "Patient Queue", icon: <ListChecks className="w-5 h-5" /> },
  { href: "/doctor/patients", label: "Patients", icon: <Users className="w-5 h-5" /> },
  { href: "/doctor/calendar", label: "Calendar", icon: <CalendarDays className="w-5 h-5" /> },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="DOCTOR"
        menuItems={menuItems}
      />
      <div className="flex-1 ml-64">
        <TopBar title="Doctor Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
