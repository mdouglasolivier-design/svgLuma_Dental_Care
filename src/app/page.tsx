"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  HeartPulse,
  Siren,
  CheckCircle2,
  Star,
  Calendar,
  Users,
  Award,
  ThumbsUp,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

const features = [
  { icon: <Shield className="w-6 h-6 text-teal-600" />, title: "Preventive Care", desc: "Routine checkups and cleanings to keep your smile healthy." },
  { icon: <Sparkles className="w-6 h-6 text-teal-600" />, title: "Cosmetic Dentistry", desc: "Enhance your smile with teeth whitening, veneers, and more." },
  { icon: <HeartPulse className="w-6 h-6 text-teal-600" />, title: "Restorative Care", desc: "Fillings, crowns, and advanced treatments for lasting results." },
  { icon: <Siren className="w-6 h-6 text-teal-600" />, title: "Emergency Care", desc: "Same-day care for dental emergencies when you need it most." },
];

const stats = [
  { icon: <Award className="w-5 h-5" />, value: "15+", label: "Years of Experience" },
  { icon: <Users className="w-5 h-5" />, value: "1,200+", label: "Happy Patients" },
  { icon: <ThumbsUp className="w-5 h-5" />, value: "98%", label: "Satisfaction Rate" },
  { icon: <Star className="w-5 h-5" />, value: "10+", label: "Dental Care Experts" },
];

export default function HomePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pageImage, setPageImage] = useState<{ heroImage: string | null; heroTitle: string | null; heroSubtitle: string | null }>({ heroImage: null, heroTitle: null, heroSubtitle: null });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    fetch("/api/testimonials").then((r) => r.json()).then(setTestimonials).catch(() => {});
    fetch("/api/page-images?pageKey=home").then((r) => r.json()).then(setPageImage).catch(() => {});
  }, []);

  const clinicName = settings.clinicName || "Luma Dental Care";
  const tagline = settings.tagline || "Where smiles come first";
  const logo = settings.logo || "";
  const heroTitle = pageImage.heroTitle || "Healthy Smiles Start Here";
  const heroSubtitle = pageImage.heroSubtitle || "Modern care, advanced technology, and a gentle approach — all in one place.";

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={pageImage.heroImage ? {
            backgroundImage: `linear-gradient(rgba(248,250,252,0.92), rgba(248,250,252,0.92)), url(${pageImage.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : { background: "linear-gradient(to bottom right, #f8fafc, #f0fdfa)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-serif">
                  {heroTitle.split(" ").map((word, i) => {
                    const tealWords = ["Smiles", "Start", "Here", "Compassion", "Connected", "Treatments", "Every", "Minutes", "Visit"];
                    const isTeal = tealWords.some(tw => word.toLowerCase().includes(tw.toLowerCase()));
                    return (
                      <span key={i} className={isTeal ? "text-teal-600" : ""}>
                        {word}{" "}
                      </span>
                    );
                  })}
                </h1>
                <p className="mt-6 text-xl text-slate-600 max-w-lg leading-relaxed font-light">
                  {heroSubtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/booking" className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Link>
                  <Link href="/about" className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:border-slate-400 transition-all">
                    Learn More
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    Trusted by 1,000+ Patients
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    5-Star Patient Rated
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    We Accept Most Insurance Plans
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-4">
                  <img src="/dental-chair.png" alt="Modern dental chair and equipment" className="w-full h-auto rounded-xl object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif">Comprehensive Dental Care</h2>
              <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">Everything you need for a healthy, beautiful smile under one roof.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all bg-white group">
                  <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors">{f.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="aspect-video bg-gradient-to-br from-teal-50 to-slate-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    {logo ? (
                      <img src={logo} alt={clinicName} className="w-16 h-16 rounded-full object-contain mx-auto mb-4" />
                    ) : (
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      </div>
                    )}
                    <p className="text-slate-600 font-medium">{clinicName}</p>
                    <p className="text-sm text-slate-400 mt-1">{tagline}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Welcome to {clinicName}</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-5 font-serif leading-tight">Comfortable Care.<br />Confident You.</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">Our mission is to provide exceptional dental care in a comfortable, friendly environment. We treat every patient like family.</p>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">{s.icon}</div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials — dynamic from admin */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif">What Our Patients Say</h2>
              <p className="mt-3 text-lg text-slate-500">Join 1,000+ patients who love their smiles.</p>
            </div>
            {testimonials.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                    <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <div className="font-semibold text-slate-900 text-sm">— {t.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">No testimonials yet.</div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-serif">Ready for a Healthier Smile?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto">Book your appointment today and experience the {clinicName} difference.</p>
            <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-teal-600 px-10 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all shadow-lg">
              Book Appointment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
