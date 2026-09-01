"use client";

import { useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: window.location.origin + "/" });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900">{session?.user?.name || "User"}</div>
          <div className="text-xs text-slate-500">{session?.user?.email}</div>
        </div>
        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-slate-500" />
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
