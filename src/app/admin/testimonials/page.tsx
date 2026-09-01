"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Star, X, Save } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string | null;
  active: boolean;
  sortOrder: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", text: "", rating: 5 }); setShowModal(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, text: t.text, rating: t.rating }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.text) return;
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/testimonials/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  const handleToggleActive = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !t.active }) });
    fetchTestimonials();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient testimonials shown on the website</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No testimonials yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl border p-5 flex items-start gap-4 ${t.active ? "border-slate-200" : "border-slate-200 opacity-50"}`}>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-700 font-bold">
                {t.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">{t.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {!t.active && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-sm text-slate-600">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggleActive(t)} className={`text-xs px-2 py-1 rounded ${t.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {t.active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => openEdit(t)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">{editing ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah M." className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Testimonial Text *</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="What did the patient say?" rows={4} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setForm({ ...form, rating: r })} className="p-1">
                      <Star className={`w-6 h-6 ${r <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.text} className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
