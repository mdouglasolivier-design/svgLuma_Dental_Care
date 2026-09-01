"use client";

import { useState, useEffect } from "react";
import { Users, Lightbulb, Heart, Calendar, Award, Star, Mail, User } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photo: string | null;
  email: string | null;
  specialty: string | null;
}

const values = [
  { icon: <Users className="w-6 h-6 text-teal-600" />, title: "Expert Team", desc: "Our experienced dentists and staff bring skill, compassion, and dedication to every smile." },
  { icon: <Lightbulb className="w-6 h-6 text-teal-600" />, title: "Advanced Technology", desc: "We invest in the latest dental technology for precise, comfortable, and effective treatment." },
  { icon: <Heart className="w-6 h-6 text-teal-600" />, title: "Patient-First Care", desc: "Your comfort, safety, and satisfaction are our top priorities at every step of your journey." },
];

const timeline = [
  { year: "2015", title: "Founded", desc: "Founded with a vision to make quality dental care accessible and personal." },
  { year: "2018", title: "Expanded Team", desc: "Grew our team of skilled professionals to better serve our increasing community." },
  { year: "2022", title: "New Technology", desc: "Introduced advanced diagnostic and treatment technology for better results and comfort." },
  { year: "2025", title: "Growing Smiles", desc: "Continuing to grow and create healthier, happier smiles for our community and beyond." },
];

export default function AboutPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [pageImage, setPageImage] = useState<{ heroImage: string | null; heroTitle: string | null; heroSubtitle: string | null }>({ heroImage: null, heroTitle: null, heroSubtitle: null });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    fetch("/api/team").then((r) => r.json()).then(setTeam).catch(() => {});
    fetch("/api/page-images?pageKey=about").then((r) => r.json()).then(setPageImage).catch(() => {});
  }, []);

  const clinicName = settings.clinicName || "Luma Dental Care";
  const heroTitle = pageImage.heroTitle || "Care With Compassion";
  const heroSubtitle = pageImage.heroSubtitle || `At ${clinicName}, we believe a healthy smile can change everything. Since 2015, we've been providing gentle, high-quality dental care in a warm, welcoming environment.`;

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Get to Know Us</p>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-serif">
                {heroTitle.split(" ").map((word, i) => {
                  const tealWords = ["With", "Compassion", "Connected", "Care"];
                  const isTeal = tealWords.some(tw => word.toLowerCase().includes(tw.toLowerCase()));
                  return <span key={i} className={isTeal ? "text-teal-600" : ""}>{word} </span>;
                })}
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed font-light">{heroSubtitle}</p>
              <p className="mt-4 text-lg text-slate-600">Our mission is simple — to treat every patient like family and make every visit a positive experience.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="aspect-video bg-gradient-to-br from-teal-100 to-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium text-lg">Our Dental Team</p>
                  <p className="text-sm text-slate-400 mt-1">Compassionate & Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif">Why Choose Us</h2>
            <p className="mt-3 text-lg text-slate-500">What makes our practice special.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all bg-white group">
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors">{v.icon}</div>
                <h3 className="font-bold text-slate-900 mb-3 text-xl">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12 font-serif">Our Journey</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {timeline.map((t) => (
              <div key={t.year} className="text-center">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{t.year}</div>
                <div className="font-semibold text-teal-600 mt-1">{t.title}</div>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members — dynamic from admin */}
      {team.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif">Meet Our Team</h2>
              <p className="mt-3 text-lg text-slate-500">The people behind your healthy smile.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="h-48 bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-teal-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-lg">{m.name}</h3>
                    <p className="text-teal-600 font-medium text-sm">{m.title}</p>
                    {m.specialty && <p className="text-xs text-slate-400 mt-1">{m.specialty}</p>}
                    {m.bio && <p className="text-sm text-slate-500 mt-3 leading-relaxed">{m.bio}</p>}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-sm text-teal-600 mt-3 hover:text-teal-700">
                        <Mail className="w-3.5 h-3.5" /> Contact
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Trust */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div>
              <blockquote className="text-lg text-slate-700 italic mb-4 leading-relaxed">&ldquo;The dental team is amazing! They make every visit comfortable and stress-free. Highly recommend!&rdquo;</blockquote>
              <div className="font-semibold text-slate-900">— Sarah M.</div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center"><Award className="w-8 h-8 text-teal-600" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Trusted by Our Community</h3>
                  <p className="text-slate-500 text-sm">Thank you to the 1,000+ patients who trust us with their smiles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
