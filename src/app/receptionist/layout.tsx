"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  { href: "/receptionist/overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/receptionist/appointments", label: "Appointments", icon: <Calendar className="w-5 h-5" /> },
  { href: "/receptionist/queries", label: "Patient Queries", icon: <MessageSquare className="w-5 h-5" /> },
];

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
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
      <Sidebar role="RECEPTIONIST" menuItems={menuItems} />
      <div className="flex-1 ml-64">
        <TopBar title="Reception Desk" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
