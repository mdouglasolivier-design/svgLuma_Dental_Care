"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Globe, Eye } from "lucide-react";

interface PageImage {
  id?: string;
  pageKey: string;
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
}

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page",
  about: "About Us",
  services: "Services",
  booking: "Booking",
  contact: "Contact",
};

const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  booking: "/booking",
  contact: "/contact",
};

export default function AdminPageImagesPage() {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    fetch("/api/page-images")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPages(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getPageData = (pageKey: string): PageImage => {
    return pages.find((p) => p.pageKey === pageKey) || { pageKey, heroImage: null, heroTitle: null, heroSubtitle: null };
  };

  const updatePage = (pageKey: string, field: keyof PageImage, value: string | null) => {
    setPages((prev) => {
      const existing = prev.find((p) => p.pageKey === pageKey);
      if (existing) {
        return prev.map((p) => (p.pageKey === pageKey ? { ...p, [field]: value } : p));
      }
      return [...prev, { pageKey, heroImage: null, heroTitle: null, heroSubtitle: null, [field]: value }];
    });
  };

  const handleImageUpload = async (pageKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(pageKey);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) updatePage(pageKey, "heroImage", data.url);
    } catch (e) { console.error(e); }
    setUploading(null);
  };

  const handleSave = async (pageKey: string) => {
    setSaving(pageKey);
    const pageData = getPageData(pageKey);
    try {
      await fetch("/api/page-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, heroImage: pageData.heroImage, heroTitle: pageData.heroTitle, heroSubtitle: pageData.heroSubtitle }),
      });
    } catch (e) { console.error(e); }
    setSaving(null);
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading...</div>;

  const current = getPageData(activePage);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Page Images & Content</h1>
        <p className="text-sm text-slate-500 mt-1">Manage background images and hero text for each public page</p>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(PAGE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activePage === key ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Editor for current page */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            {PAGE_LABELS[activePage]} Settings
          </h2>
          <a href={PAGE_ROUTES[activePage]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
            <Eye className="w-4 h-4" /> Preview
          </a>
        </div>

        <div className="space-y-6">
          {/* Background image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Background Image</label>
            <div className="flex items-start gap-4">
              {current.heroImage ? (
                <div className="relative w-64 h-36 rounded-lg overflow-hidden border border-slate-200">
                  <img src={current.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  <button
                    onClick={() => updatePage(activePage, "heroImage", null)}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="w-64 h-36 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors">
                  {uploading === activePage ? (
                    <span className="text-sm text-slate-400">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-sm text-slate-400">Upload image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(activePage, e)} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Recommended: 1920×1080px or similar wide format</p>
          </div>

          {/* Hero title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
            <input
              type="text"
              value={current.heroTitle || ""}
              onChange={(e) => updatePage(activePage, "heroTitle", e.target.value)}
              placeholder="e.g. Healthy Smiles Start Here"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Hero subtitle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
            <textarea
              value={current.heroSubtitle || ""}
              onChange={(e) => updatePage(activePage, "heroSubtitle", e.target.value)}
              placeholder="e.g. Modern care, advanced technology..."
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleSave(activePage)}
              disabled={saving === activePage}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving === activePage ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
