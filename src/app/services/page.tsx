"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, AlignLeft, Sun, CircleDot, Baby, Siren, ArrowRight, CheckCircle2, Star, Clock, Shield, ImageIcon } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

const iconMap: Record<string, React.ReactNode> = {
  "shield-check": <ShieldCheck className="w-8 h-8 text-teal-600" />,
  sparkles: <Sparkles className="w-8 h-8 text-teal-600" />,
  "align-left": <AlignLeft className="w-8 h-8 text-teal-600" />,
  sun: <Sun className="w-8 h-8 text-teal-600" />,
  "circle-dot": <CircleDot className="w-8 h-8 text-teal-600" />,
  baby: <Baby className="w-8 h-8 text-teal-600" />,
  siren: <Siren className="w-8 h-8 text-teal-600" />,
};

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [pageImage, setPageImage] = useState<{ heroImage: string | null; heroTitle: string | null; heroSubtitle: string | null }>({ heroImage: null, heroTitle: null, heroSubtitle: null });
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices).catch(() => {});
    fetch("/api/page-images?pageKey=services").then((r) => r.json()).then(setPageImage).catch(() => {});
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const heroTitle = pageImage.heroTitle || "Treatments Tailored For Every Smile";
  const heroSubtitle = pageImage.heroSubtitle || "From preventive care to advanced treatments, we offer a full range of services to keep your smile healthy, confident, and radiant.";

  return (
    <>
      <Header />
      <main className="flex-1">
      {/* Hero */}
      <section
        className="relative py-20 lg:py-28"
        style={pageImage.heroImage ? {
          backgroundImage: `linear-gradient(rgba(248,250,252,0.92), rgba(248,250,252,0.92)), url(${pageImage.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : { background: "linear-gradient(to bottom right, #f8fafc, #f0fdfa)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Complete Dental Solutions</p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-serif mb-5">
                {heroTitle.split(" ").map((word, i) => {
                  const tealWords = ["Every", "Smile", "Tailored"];
                  const isTeal = tealWords.some(tw => word.toLowerCase().includes(tw.toLowerCase()));
                  return <span key={i} className={isTeal ? "text-teal-600" : ""}>{word} </span>;
                })}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">{heroSubtitle}</p>
              <div className="flex gap-3 mb-8">
                <Link href="/booking" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">Book Appointment</Link>
                <button onClick={scrollToServices} className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white hover:border-slate-400 transition-all">View All Services <ArrowRight className="w-4 h-4" /></button>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Why Patients Trust Us</h3>
                <ul className="space-y-2">
                  {["Experienced & Caring Team", "Advanced Technology", "Personalized Care for All Ages"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-teal-600" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all overflow-hidden group">
                    {s.image ? (
                      <div className="h-40 overflow-hidden">
                        <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="h-40 bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                        {iconMap[s.icon || ""] || <ImageIcon className="w-8 h-8 text-teal-300" />}
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">{s.category}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration} min</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{s.name}</h3>
                      <p className="text-sm text-slate-500 mb-3 leading-relaxed">{s.description}</p>
                      <Link href="/booking" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">Book Now <ArrowRight className="w-3 h-3" /></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white py-14 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-5 h-5 text-teal-600" />, text: "Trusted by 1,000+ Patients" },
              { icon: <Star className="w-5 h-5 text-teal-600" />, text: "5-Star Patient Rated" },
              { icon: <Shield className="w-5 h-5 text-teal-600" />, text: "We Accept Most Insurance Plans" },
              { icon: <Clock className="w-5 h-5 text-teal-600" />, text: "Flexible Scheduling & Same-Day Care" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">{b.icon}</div>
                <span className="text-sm font-medium text-slate-700">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
