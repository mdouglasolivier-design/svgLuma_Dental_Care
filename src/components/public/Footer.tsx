"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const clinicName = settings.clinicName || "Luma Dental Care";
  const tagline = settings.tagline || "Where smiles come first";
  const phone = settings.phone || "+1 (844) 978-4949";
  const email = settings.email || "info@lumadental.com";
  const logo = settings.logo || "";

  const nameParts = clinicName.split(" ");
  const firstName = nameParts[0] || "Luma";
  const restName = nameParts.slice(1).join(" ") || "";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {logo ? (
                <img src={logo} alt={clinicName} className="h-8 w-auto rounded" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
              )}
              <div>
                <span className="text-lg font-bold">{firstName}</span>
                {restName && <span className="text-lg font-bold"> {restName}</span>}
                <span className="block text-xs text-teal-400 font-medium -mt-1">{tagline}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Modern dental care with advanced technology and a gentle approach.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Services", href: "/services" }, { label: "Booking", href: "/booking" }, { label: "Contact", href: "/contact" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Services</h3>
            <ul className="space-y-2">
              {["Preventive Care", "Cosmetic Dentistry", "Invisalign", "Teeth Whitening", "Emergency Care"].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-teal-400" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-teal-400" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5" />
                123 Smile Street, Suite 200, Cityville, CA 90210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 {clinicName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
