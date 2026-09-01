"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const clinicName = settings.clinicName || "Luma Dental Care";
  const tagline = settings.tagline || "Dental Care";
  const phone = settings.phone || "+1 (844) 978-4949";
  const logo = settings.logo || "";

  const nameParts = clinicName.split(" ");
  const firstName = nameParts[0] || "Luma";
  const restName = nameParts.slice(1).join(" ") || "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={clinicName} className="h-9 w-auto rounded" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
            )}
            <div>
              <span className="text-lg font-bold text-slate-900">{firstName}</span>
              {restName && (
                <span className="text-lg font-bold text-slate-900"> {restName}</span>
              )}
              <span className="block text-xs text-teal-600 font-medium -mt-1">{tagline}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-teal-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="hidden md:flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <div>
                <span className="block text-xs text-slate-400">Call Us Anytime</span>
                <span className="font-medium text-slate-900">{phone}</span>
              </div>
            </a>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Book Appointment
            </Link>
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-100 mt-2 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-2 rounded-lg ${
                    pathname === link.href
                      ? "text-teal-600 bg-teal-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="text-sm font-medium px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
              <Link
                href="/register"
                className="text-sm font-medium px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
