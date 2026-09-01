"use client";

import { useEffect, useState, useRef } from "react";
import { Edit2, Trash2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  icon: string | null;
  image: string | null;
  active: boolean;
}

const CATEGORIES = ["Preventive", "Cosmetic", "Orthodontics", "Restorative", "Pediatric", "Emergency"];

const emptyForm = {
  name: "",
  description: "",
  duration: 60,
  category: "Preventive",
  icon: "",
  image: "",
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadServices = () => {
    fetch("/api/services?all=true")
      .then((r) => r.json())
      .then(setServices);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description,
      duration: s.duration,
      category: s.category,
      icon: s.icon || "",
      image: s.image || "",
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads/services");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, image: data.url });
      } else {
        alert("Failed to upload image");
      }
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/services/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      loadServices();
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save service", e);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    loadServices();
  };

  const handleToggleActive = async (s: Service) => {
    await fetch(`/api/services/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    loadServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Services Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Add, edit, or deactivate services. Images will appear on the public Services page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-medium text-slate-600">Image</th>
              <th className="text-left p-3 font-medium text-slate-600">Name</th>
              <th className="text-left p-3 font-medium text-slate-600">Category</th>
              <th className="text-left p-3 font-medium text-slate-600">Duration</th>
              <th className="text-left p-3 font-medium text-slate-600">Status</th>
              <th className="text-left p-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium text-slate-900">{s.name}</td>
                <td className="p-3 text-slate-600">{s.category}</td>
                <td className="p-3 text-slate-600">{s.duration} min</td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleActive(s)}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      s.active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-teal-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <p className="text-center text-slate-400 py-8">No services found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Image</label>
                {form.image ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
                    <img src={form.image} alt="Service" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">{uploading ? "Uploading..." : "Click to upload image"}</span>
                    <span className="text-xs text-slate-300">JPEG, PNG, WebP (max 5MB)</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Teeth Whitening"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 30 })}
                    min={15}
                    step={15}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the service..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.description}
                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
