// src/pages/PujaView.tsx
// PREMIUM PUJA VIEWER — Updated UI to match TempleView fonts & styling

import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  image?: string;
  images?: string[];
  videoUrl?: string;

  deityAssociated?: Record<string, string>;
  description?: Record<string, string>;
  whyPerform?: Record<string, string>;
  benefits?: Record<string, string>;
  procedure?: Record<string, string>;
  mantra?: Record<string, string>;
  duration?: string;
  materialsRequired?: Record<string, string>;
  availableAt?: Record<string, string>[];
  placesDescription?: Record<string, string>;

  packages?: {
    key: string;
    title: Record<string, string>;
    price?: number;
    discountPrice?: number;
    details?: Record<string, string>;
    benefits?: Record<string, string>;
  }[];
}

type PujaPackage = NonNullable<Puja["packages"]>[number];

export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language || "en";
  const backendURL = import.meta.env.VITE_API_URL;

  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  useEffect(() => {
    axios
      .get(`${backendURL}/api/pujas/${id}`)
      .then((res) => setPuja(res.data))
      .catch(() => setPuja(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  // Load Merriweather font dynamically
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  if (loading)
    return (
      <div className="pt-24 flex justify-center text-lg text-gray-500">
        Loading Puja…
      </div>
    );

  if (!puja)
    return (
      <div className="pt-24 flex justify-center text-lg text-red-600">
        Puja not found.
      </div>
    );

  // Build gallery
  const gallery = [...(puja.images || [])];
  if (puja.image && !gallery.includes(puja.image)) gallery.unshift(puja.image);
  if (gallery.length === 0) gallery.push("/puja-placeholder.jpg");

  const mainImg = hoverPreview || gallery[activeIndex];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  const glow = "shadow-[0_6px_18px_rgba(170,120,60,0.25)]";

  return (
    <div className="pt-20 pb-20 bg-gradient-to-b from-[#fff8ec] via-[#fffdf9] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* PAGE TITLE */}
        <h1 className="mt-4 text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
          {t(puja.name)}
        </h1>

        <p className="text-gray-700 mb-6" style={{ fontFamily: "'Merriweather', serif" }}>
          {puja.category} {puja.subCategory ? `› ${puja.subCategory}` : ""}
        </p>

        {/* IMAGE SECTION */}
        <div className="flex justify-center mt-6 mb-12">
          <div className={`rounded-3xl overflow-hidden bg-white p-4 ${glow} w-full max-w-3xl`}>
            
            <div className="h-[240px] md:h-[300px] lg:h-[340px] flex justify-center items-center bg-gradient-to-b from-white to-[#fff3e2] relative rounded-xl">
              <img src={mainImg} className="max-w-full max-h-full object-contain" />

              {puja.videoUrl && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="absolute bottom-4 right-4 bg-white/90 text-[#8a3c0f] px-4 py-2 rounded-full shadow font-medium"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  ▶ Play Video
                </button>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="p-3 flex gap-3 overflow-x-auto bg-[#fffaf5] rounded-xl mt-4 justify-center">
              {gallery.map((src, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setHoverPreview(src)}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => setActiveIndex(idx)}
                  className={`overflow-hidden rounded-xl transition-all ${
                    idx === activeIndex ? "ring-2 ring-[#d9a06a] scale-105" : "hover:scale-105"
                  }`}
                  style={{ width: 100, height: 68 }}
                >
                  <img src={src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* QUICK LINK BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-10 mt-10">
          {[
            ["overview", "Overview"],
            ["benefits", "Benefits"],
            ["procedure", "Procedure"],
            ["mantra", "Mantra"],
            ["materials", "Materials"],
            ["availability", "Availability"],
            ["packages", "Packages"],
          ].map(([sec, label]) => (
            <button
              key={sec}
              onClick={() => scrollTo(sec)}
              className={`px-5 py-2 rounded-full bg-white text-gray-800 hover:bg-[#fff3e2] transition shadow-md ${glow}`}
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SECTIONS */}
        <Section id="overview" title="Overview">
          <p>{t(puja.description)}</p>
          {puja.whyPerform && (
            <p className="mt-4">
              <strong>Why Perform:</strong> {t(puja.whyPerform)}
            </p>
          )}
        </Section>

        <Section id="benefits" title="Benefits">
          <p>{t(puja.benefits)}</p>
        </Section>

        <Section id="procedure" title="Procedure">
          <p className="whitespace-pre-line">{t(puja.procedure)}</p>
        </Section>

        <Section id="mantra" title="Main Mantra">
          <p className="text-gray-900 italic">{t(puja.mantra)}</p>
        </Section>

        <Section id="materials" title="Materials Required">
          <p>{t(puja.materialsRequired)}</p>
        </Section>

        <Section id="availability" title="Availability">
          {puja.availableAt?.length ? (
            <ul className="list-disc ml-6">
              {puja.availableAt.map((a, i) => (
                <li key={i}>{t(a)}</li>
              ))}
            </ul>
          ) : (
            <p>Not specified.</p>
          )}

          {puja.placesDescription && <p className="mt-3">{t(puja.placesDescription)}</p>}
        </Section>

        <Section id="packages" title="Puja Packages">
          {puja.packages?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {puja.packages.map((pkg) => (
                <PujaPackageCard key={pkg.key} pkg={pkg} pujaId={puja._id} />
              ))}
            </div>
          ) : (
            <p>No packages available.</p>
          )}
        </Section>
      </div>

      {videoOpen && puja.videoUrl && (
        <VideoPopup url={puja.videoUrl} onClose={() => setVideoOpen(false)} />
      )}
    </div>
  );
}

/* SECTION COMPONENT */
interface SectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mt-12">
      <h2
        className="text-3xl text-orange-800 font-semibold mb-4"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h2>

      <div className="text-gray-700 leading-relaxed" style={{ fontFamily: "'Merriweather', serif" }}>
        {children}
      </div>
    </section>
  );
}

/* PUJA PACKAGE CARD */
interface PujaPackageCardProps {
  pkg: PujaPackage;
  pujaId: string;
}

function PujaPackageCard({ pkg, pujaId }: PujaPackageCardProps) {
  const tLocal = (o?: Record<string, string>) => o?.[i18n.language] || o?.en || "";

  return (
    <div className={`p-6 rounded-2xl bg-white shadow-md`}>
      <h3 className="text-xl font-bold text-orange-800" style={{ fontFamily: "'Merriweather', serif" }}>
        {tLocal(pkg.title)}
      </h3>

      <p className="text-2xl font-semibold text-gray-900 mt-2">
        ₹{pkg.discountPrice || pkg.price}
        {pkg.discountPrice && pkg.price && (
          <span className="text-sm text-gray-500 line-through ml-2">₹{pkg.price}</span>
        )}
      </p>

      {pkg.details && <p className="mt-2 text-gray-700">{tLocal(pkg.details)}</p>}
      {pkg.benefits && <p className="mt-2 text-gray-700 italic">{tLocal(pkg.benefits)}</p>}

      <Link
        to={`/pujas/${pujaId}/book/${pkg.key}`}
        className="mt-6 block text-center bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-800"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        Book Now
      </Link>
    </div>
  );
}

/* VIDEO POPUP */
interface VideoPopupProps {
  url: string;
  onClose: () => void;
}

function VideoPopup({ url, onClose }: VideoPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-3">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="aspect-video">
          {url.includes("youtube") || url.includes("youtu.be") ? (
            <iframe className="w-full h-full" src={url.replace("watch?v=", "embed/")} allowFullScreen />
          ) : (
            <video src={url} controls className="w-full h-full bg-black" />
          )}
        </div>
      </div>
    </div>
  );
}
