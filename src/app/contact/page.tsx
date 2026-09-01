"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, AlertCircle, Share2 } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<any[]>([]);
  const [pageImage, setPageImage] = useState<{ heroImage: string | null; heroTitle: string | null; heroSubtitle: string | null }>({ heroImage: null, heroTitle: null, heroSubtitle: null });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    fetch("/api/locations").then((r) => r.json()).then(setLocations).catch(() => {});
    fetch("/api/page-images?pageKey=contact").then((r) => r.json()).then(setPageImage).catch(() => {});
  }, []);

  const phoneNum = settings.phone || "+1 (844) 978-4949";
  const emailAddr = settings.email || "info@lumadental.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { setError("Please fill in all required fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, message }) });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <main className="flex-1">
      <section
        className="relative py-20 lg:py-28"
        style={pageImage.heroImage ? {
          backgroundImage: `linear-gradient(rgba(248,250,252,0.92), rgba(248,250,252,0.92)), url(${pageImage.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : { background: "linear-gradient(to bottom right, #f8fafc, #f0fdfa)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">We&apos;re Here For You</p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-serif mb-5">{pageImage.heroTitle || "Let&apos;s Keep Your Smile Connected"}</h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">{pageImage.heroSubtitle || "Have a question or ready to book your visit? Our team is happy to help."}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3"><Phone className="w-5 h-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-slate-900 text-sm">Call Us</h3>
                  <a href={`tel:${phoneNum.replace(/[^0-9+]/g, "")}`} className="text-lg font-bold text-slate-900 hover:text-teal-600">{phoneNum}</a>
                  <p className="text-xs text-slate-500 mt-1">Mon - Sat, 9AM - 6PM</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3"><Mail className="w-5 h-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-slate-900 text-sm">Email Us</h3>
                  <a href={`mailto:${emailAddr}`} className="text-sm font-bold text-slate-900 hover:text-teal-600">{emailAddr}</a>
                  <p className="text-xs text-slate-500 mt-1">We&apos;ll respond within 1 business day</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-slate-900 text-sm">Clinic Hours</h3>
                  <div className="text-sm space-y-1 mt-1">
                    <div className="flex justify-between"><span className="text-slate-600">Mon - Fri</span><span className="font-medium">9AM - 6PM</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Saturday</span><span className="font-medium">9AM - 2PM</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Sunday</span><span className="font-medium text-red-500">Closed</span></div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3"><Share2 className="w-5 h-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-slate-900 text-sm">Follow Us</h3>
                  <p className="text-sm text-slate-600 mt-1">@LumaDentalCare</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h2>
              <p className="text-sm text-slate-500 mb-6">We&apos;d love to hear from you.</p>
              {submitted ? (
                <div className="text-center py-8"><CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-4" /><h3 className="font-semibold text-slate-900 mb-2">Message Sent!</h3><p className="text-sm text-slate-500">We&apos;ll get back to you within 1 business day.</p></div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"><AlertCircle className="w-4 h-4" />{error}</div>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={phoneNum} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">How can we help you? *</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here..." rows={4} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" /></div>
                  <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"><Send className="w-4 h-4" />{loading ? "Sending..." : "Send Message"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 font-serif">Our Locations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {locations.length > 0 ? locations.map((loc) => (
              <div key={loc.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-teal-600" /></div>
                  <div><h3 className="font-semibold text-slate-900">{loc.name}</h3><p className="text-sm text-slate-600">{loc.address}, {loc.city}, {loc.state} {loc.zip}</p></div>
                </div>
                <div className="space-y-1 text-sm text-slate-600 ml-13">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600" />{loc.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-teal-600" />{loc.hours}</div>
                </div>
                <button className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700">Get Directions →</button>
              </div>
            )) : (
              <div className="col-span-2 text-center py-8 text-slate-400">Loading locations...</div>
            )}
          </div>
        </div>
      </section>
      <section className="py-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Personalized Care", "Modern Technology", "Comfortable Experience", "Trusted by Patients"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600" />{item}</div>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
