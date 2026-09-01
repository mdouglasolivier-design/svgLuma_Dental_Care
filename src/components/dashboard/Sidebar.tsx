"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "RECEPTIONIST";
  menuItems: { href: string; label: string; icon: React.ReactNode }[];
}

export default function Sidebar({ role, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const clinicName = settings.clinicName || "Luma Dental Care";
  const logo = settings.logo || "";
  const nameParts = clinicName.split(" ");
  const firstName = nameParts[0] || "Luma";
  const restName = nameParts.slice(1).join(" ") || "";

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin Panel",
    DOCTOR: "Doctor Portal",
    PATIENT: "Patient Portal",
    RECEPTIONIST: "Reception Desk",
  };

  const { data: session } = useSession();

  const handleLogout = async () => {
    // Log the logout
    if (session?.user) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: (session.user as any).email,
            name: (session.user as any).name,
            role: (session.user as any).role,
            userId: (session.user as any).id,
          }),
        });
      } catch (e) { /* non-critical */ }
    }
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: window.location.origin + "/" });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-100">
        {logo ? (
          <img src={logo} alt={clinicName} className="h-8 w-auto rounded" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        )}
        <div>
          <span className="text-sm font-bold text-slate-900">{firstName}</span>
          {restName && <span className="text-sm font-bold text-slate-900"> {restName}</span>}
          <span className="block text-[10px] text-teal-600 font-medium -mt-0.5">{roleLabels[role] || "Portal"}</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3 border-b border-slate-100">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
          role === "ADMIN" ? "bg-purple-50 text-purple-700" :
          role === "DOCTOR" ? "bg-blue-50 text-blue-700" :
          role === "RECEPTIONIST" ? "bg-orange-50 text-orange-700" :
          "bg-teal-50 text-teal-700"
        }`}>
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
