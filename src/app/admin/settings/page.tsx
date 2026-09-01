"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Phone, Mail, Building2, Type, CheckCircle, Upload, X } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads/logo");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, logo: data.url }));
        setSaved(false);
      } else {
        alert("Failed to upload logo");
      }
    } catch (e) {
      console.error("Logo upload failed", e);
    }
    setUploadingLogo(false);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save settings", e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your clinic&apos;s public information — changes appear across the entire website immediately.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Logo */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Upload className="w-4 h-4" />
            Clinic Logo
          </label>
          {settings.logo ? (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {uploadingLogo ? "Uploading..." : "Change Logo"}
                </button>
                <button
                  onClick={() => updateField("logo", "")}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-colors"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">{uploadingLogo ? "Uploading..." : "Click to upload your logo"}</span>
              <span className="text-xs text-slate-300">Recommended: 200×200px, PNG or SVG</span>
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <p className="text-xs text-slate-400 mt-2">
            This logo appears in the header, sidebar, and footer across the entire site.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Clinic Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Building2 className="w-4 h-4" />
            Clinic Name
          </label>
          <input
            type="text"
            value={settings.clinicName || ""}
            onChange={(e) => updateField("clinicName", e.target.value)}
            placeholder="Luma Dental Care"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Shown in the header, sidebar, footer, and page title across the entire site.
          </p>
        </div>

        {/* Tagline */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Type className="w-4 h-4" />
            Tagline / Subtitle
          </label>
          <input
            type="text"
            value={settings.tagline || ""}
            onChange={(e) => updateField("tagline", e.target.value)}
            placeholder="Where smiles come first"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Short text shown below the clinic name in the header.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4" />
            Phone Number (Call Us Anytime)
          </label>
          <input
            type="tel"
            value={settings.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (844) 978-4949"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Displayed in the &quot;Call Us Anytime&quot; section of the navigation bar and in the footer.
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4" />
            Contact Email
          </label>
          <input
            type="email"
            value={settings.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="info@lumadental.com"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Shown on the Contact page and in the footer.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Settings saved! All pages updated instantly.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
