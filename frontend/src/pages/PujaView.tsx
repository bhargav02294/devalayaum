// src/pages/PujaView.tsx
// FULL MULTILINGUAL + MATCHED TEMPLE PAGE DESIGN + CLEAN ESLINT

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ----------------------------------------------------------
   Interfaces
---------------------------------------------------------- */
interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;

  image?: string;
  images?: string[];
  videoUrl?: string;

  description?: Record<string, string>;
  whyPerform?: Record<string, string>;
  benefits?: Record<string, string>;
  procedure?: Record<string, string>;
  mantra?: Record<string, string>;
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

/* ----------------------------------------------------------
   MAIN PAGE
---------------------------------------------------------- */
export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const backendURL = import.meta.env.VITE_API_URL;

  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  /* LIVE LANGUAGE STATE */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const h = (lng: string) => setLang(lng);
    i18n.on("languageChanged", h);
    return () => i18n.off("languageChanged", h);
  }, []);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  /* Load Merriweather */
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

  /* Fetch Puja */
  useEffect(() => {
    axios
      .get(`${backendURL}/api/pujas/${id}`)
      .then((res) => setPuja(res.data))
      .catch(() => setPuja(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading)
    return (
      <div className="pt-24 flex justify-center text-gray-500 text-lg">
        {t({
          en: "Loading Puja…",
          hi: "पूजा लोड हो रही है…",
          mr: "पूजा लोड होत आहे…",
        })}
      </div>
    );

  if (!puja)
    return (
      <div className="pt-24 flex justify-center text-red-600 text-lg">
        {t({
          en: "Puja not found.",
          hi: "पूजा नहीं मिली।",
          mr: "पूजा आढळली नाही.",
        })}
      </div>
    );

  /* Build Gallery */
  const gallery = [...(puja.images || [])];
  if (puja.image && !gallery.includes(puja.image)) gallery.unshift(puja.image);
  if (gallery.length === 0) gallery.push("/puja-placeholder.jpg");
  const mainImg = hoverPreview || gallery[activeIndex];

  const glow = "shadow-[0_4px_20px_rgba(255,153,51,0.18)]";

  /* Smooth Scroll */
  const scrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  /* ----------------------------------------------------
      RETURN UI
  ---------------------------------------------------- */
  return (
    <div
      className="pt-20 pb-20"
      style={{ background: "linear-gradient(to bottom, #fff7e3, #fffdf8, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h1 className="mt-8 text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
          {t(puja.name)}
        </h1>

        <p className="text-gray-700 mt-2" style={{ fontFamily: "'Merriweather', serif" }}>
          {puja.category}
          {puja.subCategory ? ` › ${puja.subCategory}` : ""}
        </p>

        {/* IMAGE + VIDEO */}
        <div className="flex justify-center mt-8 mb-14">
          <div className={`rounded-3xl overflow-hidden bg-white p-4 w-full max-w-3xl ${glow}`}>
            <div className="h-[240px] md:h-[300px] lg:h-[340px] flex justify-center items-center bg-gradient-to-b from-white via-[#fff4dd] to-white rounded-xl relative">
              <img src={mainImg} className="max-w-full max-h-full object-contain" />

              {puja.videoUrl && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="absolute bottom-3 right-3 px-4 py-2 text-sm rounded-full bg-white/90 text-orange-700 shadow hover:bg-white"
                >
                  ▶ {t({ en: "Play Video", hi: "वीडियो चलाएँ", mr: "व्हिडिओ प्ले करा" })}
                </button>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="p-4 flex gap-4 overflow-x-auto bg-[#fffaf5] rounded-xl mt-4 justify-center">
              {gallery.map((src, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setHoverPreview(src)}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => setActiveIndex(idx)}
                  className={`rounded-xl overflow-hidden transition-all ${
                    idx === activeIndex ? "ring-2 ring-orange-300 scale-105 shadow" : "hover:scale-105"
                  }`}
                  style={{ width: 100, height: 70 }}
                >
                  <img src={src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK NAV */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {[
            ["overview", t({ en: "Overview", hi: "सारांश", mr: "आढावा" })],
            ["benefits", t({ en: "Benefits", hi: "लाभ", mr: "फायदे" })],
            ["procedure", t({ en: "Procedure", hi: "विधि", mr: "प्रक्रिया" })],
            ["mantra", t({ en: "Main Mantra", hi: "मुख्य मंत्र", mr: "मुख्य मंत्र" })],
            ["materials", t({ en: "Materials Required", hi: "आवश्यक सामग्री", mr: "आवश्यक सामग्री" })],
            ["availability", t({ en: "Availability", hi: "उपलब्धता", mr: "उपलब्धता" })],
            ["packages", t({ en: "Puja Packages", hi: "पूजा पैकेज", mr: "पूजा पॅकेज" })],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`rounded-full px-4 py-1.5 text-sm bg-white shadow hover:bg-orange-50 text-gray-700 transition ${glow}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sections */}
        <Section id="overview" title={t({ en: "Overview", hi: "सारांश", mr: "आढावा" })}>
          <p>{t(puja.description)}</p>
          {puja.whyPerform && (
            <p className="mt-3">
              <span className="text-lg font-semibold text-orange-700">
                {t({ en: "Why Perform:", hi: "क्यों करें:", mr: "का का:" })}
              </span>{" "}
              {t(puja.whyPerform)}
            </p>
          )}
        </Section>

        <Section id="benefits" title={t({ en: "Benefits", hi: "लाभ", mr: "फायदे" })}>
          <p>{t(puja.benefits)}</p>
        </Section>

        <Section id="procedure" title={t({ en: "Procedure", hi: "विधि", mr: "प्रक्रिया" })}>
          <p className="whitespace-pre-line">{t(puja.procedure)}</p>
        </Section>

        <Section id="mantra" title={t({ en: "Main Mantra", hi: "मुख्य मंत्र", mr: "मुख्य मंत्र" })}>
          <p className="italic">{t(puja.mantra)}</p>
        </Section>

        <Section
          id="materials"
          title={t({ en: "Materials Required", hi: "आवश्यक सामग्री", mr: "आवश्यक सामग्री" })}
        >
          <p>{t(puja.materialsRequired)}</p>
        </Section>

        <Section id="availability" title={t({ en: "Availability", hi: "उपलब्धता", mr: "उपलब्धता" })}>
          {puja.availableAt?.length ? (
            <ul className="list-disc ml-6">
              {puja.availableAt.map((a, i) => (
                <li key={i}>{t(a)}</li>
              ))}
            </ul>
          ) : (
            <p>{t({ en: "Not specified.", hi: "निर्दिष्ट नहीं।", mr: "निश्चित नाही." })}</p>
          )}

          {puja.placesDescription && <p className="mt-2">{t(puja.placesDescription)}</p>}
        </Section>

        {/* Packages */}
        <Section id="packages" title={t({ en: "Puja Packages", hi: "पूजा पैकेज", mr: "पूजा पॅकेज" })}>
          {puja.packages?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {puja.packages.map((pkg) => (
                <PujaPackageCard key={pkg.key} pkg={pkg} pujaId={puja._id} />
              ))}
            </div>
          ) : (
            <p>{t({ en: "No packages available.", hi: "कोई पैकेज उपलब्ध नहीं।", mr: "पॅकेज उपलब्ध नाहीत." })}</p>
          )}
        </Section>
      </div>

      {videoOpen && puja.videoUrl && (
        <VideoPopup url={puja.videoUrl} onClose={() => setVideoOpen(false)} />
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   SECTION COMPONENT (Temple Page exact style)
---------------------------------------------------------- */
function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12">
      <h2
        className="text-2xl text-orange-800 font-semibold mb-4"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h2>

      <div
        className="text-gray-700 leading-relaxed"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {children}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------
   Package Card
---------------------------------------------------------- */
function PujaPackageCard({ pkg, pujaId }: { pkg: PujaPackage; pujaId: string }) {
  const lang = i18n.language;
  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  return (
    <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgba(255,153,51,0.18)]">
      <h3 className="text-lg font-semibold text-orange-700 mb-1">
        {t(pkg.title)}
      </h3>

      <p className="text-2xl font-bold text-gray-800 mt-1">
        ₹{pkg.discountPrice || pkg.price}
        {pkg.discountPrice && pkg.price && (
          <span className="ml-2 text-sm text-gray-500 line-through">₹{pkg.price}</span>
        )}
      </p>

      {pkg.details && <p className="mt-2 text-gray-700">{t(pkg.details)}</p>}
      {pkg.benefits && <p className="mt-2 text-gray-700 italic">{t(pkg.benefits)}</p>}

      <Link
        to={`/pujas/${pujaId}/book/${pkg.key}`}
        className="mt-5 block text-center bg-orange-700 text-white py-2 rounded-lg hover:bg-orange-800"
      >
        {t({ en: "Book Now", hi: "बुक करें", mr: "बुक करा" })}
      </Link>
    </div>
  );
}

/* ----------------------------------------------------------
   VIDEO POPUP
---------------------------------------------------------- */
function VideoPopup({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-3">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="aspect-video">
          {url.includes("youtube") ? (
            <iframe
              className="w-full h-full"
              src={url.replace("watch?v=", "embed/")}
              allowFullScreen
            />
          ) : (
            <video src={url} controls className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  );
}
