"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, User, Mail, Phone, Shield, X, CheckCircle } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  patient?: { id: string } | null;
  doctor?: { id: string; specialty: string; rating: number; active: boolean } | null;
}

interface DoctorProfile {
  specialty: string;
  bio: string;
}

const ROLES = ["DOCTOR", "ADMIN", "RECEPTIONIST"];
const DOCTOR_SPECIALTIES = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Orthodontics",
  "Pediatric Dentistry",
  "Oral Surgery",
  "Endodontics",
  "Periodontics",
  "Prosthodontics",
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "DOCTOR" as string,
  // Doctor-specific
  specialty: "General Dentistry",
  bio: "",
  rating: "5.0",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (u: UserRecord) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      phone: u.phone || "",
      role: u.role,
      specialty: u.doctor?.specialty || "General Dentistry",
      bio: "",
      rating: String(u.doctor?.rating || 5.0),
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      if (editing) {
        // Update existing user
        const payload: any = {
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        if (form.role === "DOCTOR") {
          payload.specialty = form.specialty;
          payload.bio = form.bio;
          payload.rating = parseFloat(form.rating) || 5.0;
        }

        const res = await fetch(`/api/admin/users/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to update user");
          setSaving(false);
          return;
        }
      } else {
        // Create new user
        if (!form.name || !form.email || !form.password) {
          setError("Name, email, and password are required");
          setSaving(false);
          return;
        }

        const payload: any = {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || null,
          role: form.role,
        };
        if (form.role === "DOCTOR") {
          payload.specialty = form.specialty;
          payload.bio = form.bio;
          payload.rating = parseFloat(form.rating) || 5.0;
        }

        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to create user");
          setSaving(false);
          return;
        }
      }

      loadUsers();
      setShowModal(false);
      setSuccess(editing ? "User updated successfully!" : "User created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setSaving(false);
  };

  const handleDeactivate = async (u: UserRecord) => {
    if (!confirm(`Deactivate ${u.name}? They won't be able to log in.`)) return;
    try {
      await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      loadUsers();
      setSuccess("User deactivated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = filter === "ALL" ? users : users.filter((u) => u.role === filter);

  const roleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-50 text-purple-700";
      case "DOCTOR": return "bg-blue-50 text-blue-700";
      case "PATIENT": return "bg-teal-50 text-teal-700";
      case "RECEPTIONIST": return "bg-orange-50 text-orange-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Register and manage staff accounts — Doctors, Admins, and Receptionists.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Role filter */}
      <div className="flex gap-2">
        {["ALL", ...ROLES].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === r
                ? "bg-teal-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {r === "ALL" ? "All Users" : r}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-medium text-slate-600">User</th>
              <th className="text-left p-3 font-medium text-slate-600">Email</th>
              <th className="text-left p-3 font-medium text-slate-600">Phone</th>
              <th className="text-left p-3 font-medium text-slate-600">Role</th>
              <th className="text-left p-3 font-medium text-slate-600">Title / Specialty</th>
              <th className="text-left p-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-900">{u.name}</span>
                  </div>
                </td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3 text-slate-600">{u.phone || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-slate-600">
                  {u.doctor?.specialty || (u.role === "ADMIN" ? "Administrator" : u.role === "RECEPTIONIST" ? "Receptionist" : "—")}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-slate-400 hover:text-teal-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeactivate(u)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="text-center text-slate-400 py-8">No users found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? "Edit User" : "Register New User"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. John Smith"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password {editing ? "(leave blank to keep current)" : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role / Title <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r === "DOCTOR" ? "Doctor / Staff" : r === "RECEPTIONIST" ? "Receptionist" : "Administrator"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor-specific fields */}
              {form.role === "DOCTOR" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                    <select
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {DOCTOR_SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Description</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={2}
                      placeholder="Short bio about the doctor..."
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                    <input
                      type="number"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      min={0}
                      max={5}
                      step={0.1}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </>
              )}
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
                disabled={saving || !form.name || !form.email || (!editing && !form.password)}
                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Register User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
