"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Save, Upload, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photo: string | null;
  email: string | null;
  specialty: string | null;
  active: boolean;
  sortOrder: number;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", title: "", bio: "", email: "", specialty: "", photo: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMembers(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", title: "", bio: "", email: "", specialty: "", photo: "" }); setShowModal(true); };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ name: m.name, title: m.title, bio: m.bio || "", email: m.email || "", specialty: m.specialty || "", photo: m.photo || "" });
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.title) return;
    setSaving(true);
    try {
      const payload = { name: form.name, title: form.title, bio: form.bio || null, email: form.email || null, specialty: form.specialty || null, photo: form.photo || null };
      if (editing) {
        await fetch(`/api/team/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchMembers();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const handleToggleActive = async (m: TeamMember) => {
    await fetch(`/api/team/${m.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !m.active }) });
    fetchMembers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your team displayed on the About page</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No team members yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className={`bg-white rounded-xl border p-5 ${m.active ? "border-slate-200" : "border-slate-200 opacity-50"}`}>
              <div className="flex items-start gap-3 mb-3">
                {m.photo ? (
                  <img src={m.photo} alt={m.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-teal-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{m.name}</h3>
                  <p className="text-sm text-teal-600">{m.title}</p>
                  {m.specialty && <p className="text-xs text-slate-400">{m.specialty}</p>}
                </div>
              </div>
              {m.bio && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{m.bio}</p>}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => handleToggleActive(m)} className={`text-xs px-2 py-1 rounded ${m.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {m.active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">{editing ? "Edit" : "Add"} Team Member</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Photo upload */}
              <div className="flex items-center gap-4">
                {form.photo ? (
                  <img src={form.photo} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-slate-400" /></div>
                )}
                <label className="cursor-pointer text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Jane Doe" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title / Position *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lead Dentist" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                  <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="General Dentistry" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about this team member..." rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.title} className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
