"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  MapPin,
  MessageSquare,
  Settings,
  UserPlus,
  Quote,
  Image,
  Database,
  Activity,
} from "lucide-react";

const menuItems = [
  { href: "/admin/overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/bookings", label: "Bookings", icon: <Calendar className="w-5 h-5" /> },
  { href: "/admin/users", label: "User Management", icon: <UserPlus className="w-5 h-5" /> },
  { href: "/admin/staff", label: "Staff Directory", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/services", label: "Services", icon: <Stethoscope className="w-5 h-5" /> },
  { href: "/admin/locations", label: "Locations", icon: <MapPin className="w-5 h-5" /> },
  { href: "/admin/testimonials", label: "Testimonials", icon: <Quote className="w-5 h-5" /> },
  { href: "/admin/team", label: "Team Members", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/page-images", label: "Page Images", icon: <Image className="w-5 h-5" /> },
  { href: "/admin/messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/admin/activity-log", label: "Activity Log", icon: <Activity className="w-5 h-5" /> },
  { href: "/admin/database", label: "Database", icon: <Database className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Site Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        role="ADMIN"
        menuItems={menuItems}
      />
      <div className="flex-1 ml-64">
        <TopBar title="Admin Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
