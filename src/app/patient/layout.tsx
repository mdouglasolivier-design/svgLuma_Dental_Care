"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
} from "lucide-react";

const menuItems = [
  { href: "/patient/overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/patient/appointments", label: "Appointments", icon: <Calendar className="w-5 h-5" /> },
  { href: "/patient/records", label: "Records", icon: <FileText className="w-5 h-5" /> },
  { href: "/patient/billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/patient/messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/patient/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
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
        role="PATIENT"
        menuItems={menuItems}
      />
      <div className="flex-1 ml-64">
        <TopBar title="Patient Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
