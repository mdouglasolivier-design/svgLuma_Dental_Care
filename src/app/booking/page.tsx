"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Mail, Phone, ChevronRight, CheckCircle2, Shield, Plus, AlertCircle, KeyRound } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

type Service = { id: string; name: string; duration: number; category: string };
type Doctor = { id: string; name: string; specialty: string; rating: number };
type Location = { id: string; name: string; address: string; city: string; state: string; zip: string };

const steps = ["Doctor", "Date & Time", "Your Info", "Confirm"];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pageImage, setPageImage] = useState<{ heroImage: string | null; heroTitle: string | null; heroSubtitle: string | null }>({ heroImage: null, heroTitle: null, heroSubtitle: null });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [defaultService, setDefaultService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(true);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((s) => {
      setServices(s);
      // Auto-select first service as default
      if (s.length > 0 && !selectedService) {
        setSelectedService(s[0]);
        setDefaultService(s[0]);
      }
    });
    fetch("/api/doctors").then((r) => r.json()).then(setDoctors);
    fetch("/api/locations").then((r) => r.json()).then(setLocations);
    fetch("/api/page-images?pageKey=booking").then((r) => r.json()).then(setPageImage).catch(() => {});
  }, []);

  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedLocation || !selectedDate || !selectedTime || !name || !email || !phone) {
      setError("Please fill in all required fields including phone number.");
      return;
    }
    if (createAccount && password.length < 6) {
      setError("Password must be at least 6 characters, or uncheck 'Create account'.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService!.id,
          doctorId: selectedDoctor.id,
          locationId: selectedLocation.id,
          date: selectedDate,
          time: selectedTime,
          name,
          email,
          phone,
          reason,
          password: createAccount ? password : undefined,
        }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to book"); }
      setSubmitted(true);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  if (submitted) {
    return (
    <>
      <Header />
      <main className="flex-1">
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-teal-600" /></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 font-serif">Appointment Confirmed!</h2>
          <p className="text-slate-600 mb-6">Your appointment has been booked successfully. You&apos;ll receive a confirmation email at <strong>{email}</strong>.</p>
          {createAccount && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-sm">
              <p className="text-teal-800 font-medium mb-1">Your account is ready!</p>
              <p className="text-teal-700">You can now log in to view and manage your appointments.</p>
              <a href="/login" className="mt-2 inline-block text-teal-600 hover:text-teal-700 font-medium">
                Sign In to Your Account →
              </a>
            </div>
          )}
          {!createAccount && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-sm">
              <p className="text-slate-700 font-medium mb-1">Want to manage your appointments?</p>
              <p className="text-slate-600">Create an account to view, reschedule, or cancel appointments online.</p>
              <a href="/register" className="mt-2 inline-block text-teal-600 hover:text-teal-700 font-medium">
                Create an Account →
              </a>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 text-sm">
            {[["Service", selectedService?.name], ["Doctor", selectedDoctor?.name], ["Date", selectedDate], ["Time", selectedTime], ["Location", selectedLocation?.name]].map(([l, v]) => (
              <div key={String(l)} className="flex justify-between"><span className="text-slate-500">{String(l)}</span><span className="font-medium">{String(v)}</span></div>
            ))}
          </div>
          <a href="/" className="mt-6 inline-block text-sm text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
      </main>
      <Footer />
    </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
    <div
      className="min-h-[80vh]"
      style={pageImage.heroImage ? {
        backgroundImage: `linear-gradient(rgba(248,250,252,0.95), rgba(248,250,252,0.95)), url(${pageImage.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : { background: "linear-gradient(to bottom right, #f8fafc, #f0fdfa)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-serif">{pageImage.heroTitle || "Book Your Visit"}<span className="text-teal-600 block">{pageImage.heroSubtitle || "In Minutes"}</span></h1>
          <p className="mt-3 text-lg text-slate-600 font-light">Simple. Fast. Convenient. Schedule your appointment in just a few easy steps.</p>
        </div>
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i <= step ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${i <= step ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"><AlertCircle className="w-4 h-4" />{error}</div>}
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Choose Doctor</h2>
                <div className="space-y-2">
                  {doctors.map((d) => (
                    <button key={d.id} onClick={() => setSelectedDoctor(d)} className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${selectedDoctor?.id === d.id ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-slate-400" /></div>
                          <div><div className="font-medium text-slate-900">{d.name}</div><div className="text-sm text-slate-500">{d.specialty}</div></div>
                        </div>
                        <div className="text-sm font-medium text-amber-500">★ {d.rating}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Select Date & Time</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <select value={selectedLocation?.id || ""} onChange={(e) => setSelectedLocation(locations.find((l) => l.id === e.target.value) || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="">Select location</option>
                      {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Available Times</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {times.map((t) => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 rounded-lg border text-sm font-medium transition-colors ${selectedTime === t ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Your Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit (Optional)</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us about your visit..." rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                </div>

                {/* Account creation section */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-medium text-slate-900 text-sm">Create an account for easy management</span>
                      <p className="text-xs text-slate-500 mt-0.5">Book faster next time, view your appointments online, and manage your dental care.</p>
                    </div>
                  </label>
                  {createAccount && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                        Choose a Password *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <p className="mt-1 text-xs text-slate-500">You&apos;ll use this to log in and manage your appointments.</p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs text-slate-500 flex items-center gap-1"><Shield className="w-3 h-3" /> Your information is secure and encrypted.</p>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">4. Confirm Your Appointment</h2>
                <div className="space-y-3 bg-slate-50 rounded-xl p-4 text-sm">
                  {[["Service", selectedService?.name], ["Doctor", selectedDoctor?.name], ["Date", selectedDate], ["Time", selectedTime], ["Location", selectedLocation?.name], ["Patient", name], ["Email", email], ...(reason ? [["Reason", reason]] : [])].map(([l, v]) => (
                    <div key={String(l)} className="flex justify-between"><span className="text-slate-500">{String(l)}</span><span className="font-medium">{String(v)}</span></div>
                  ))}
                  {createAccount && (
                    <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-medium text-teal-600">Will be created</span></div>
                  )}
                </div>
                {!createAccount && (
                  <p className="mt-3 text-xs text-slate-500">
                    💡 You can <a href="/register" className="text-teal-600 hover:underline">create an account</a> later to manage your appointments online.
                  </p>
                )}
              </div>
            )}
            <div className="flex justify-between mt-8">
              {step > 0 ? <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Back</button> : <div />}
              {step < 3 ? <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">Next</button>
                : <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50">{loading ? "Booking..." : "Confirm Appointment"}</button>}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Appointment Summary</h3>
              <div className="space-y-4 text-sm">
                {[{ icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />, label: "Service", value: selectedService?.name },
                  { icon: <User className="w-4 h-4 text-teal-600" />, label: "Doctor", value: selectedDoctor?.name },
                  { icon: <Calendar className="w-4 h-4 text-teal-600" />, label: "Date", value: selectedDate },
                  { icon: <Clock className="w-4 h-4 text-teal-600" />, label: "Time", value: selectedTime },
                  { icon: <MapPin className="w-4 h-4 text-teal-600" />, label: "Location", value: selectedLocation?.name }].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div><div className="text-slate-400 text-xs">{item.label}</div><div className="font-medium">{item.value || "—"}</div></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-teal-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-teal-700"><Plus className="w-4 h-4" /> New Patient Visit</div>
                <p className="text-xs text-teal-600 mt-1">We look forward to welcoming you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
}
