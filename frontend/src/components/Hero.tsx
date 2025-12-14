// src/components/Hero.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import i18n from "../i18n";

type LangText = Record<string, string>;

interface Slide {
  title: LangText;
  text: LangText;
  btn: LangText;
  link: string;
  img: string;
  alt: LangText;
}

export default function Hero() {
  const lang = i18n.language || "en";
  const [, setRender] = useState(false);

  useEffect(() => {
    const handler = () => setRender((v) => !v);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const slides: Slide[] = [
    {
      title: {
        en: "Explore Sacred Temples of India",
        hi: "भारत के पवित्र मंदिरों की खोज करें",
        mr: "भारताची पवित्र मंदिरे शोधा",
      },
      text: {
        en: "Discover ancient Hindu temples, divine places and spiritual heritage across India.",
        hi: "भारत भर के प्राचीन हिंदू मंदिरों और दिव्य स्थलों को जानें।",
        mr: "भारतभरातील प्राचीन हिंदू मंदिरे आणि पवित्र स्थळे शोधा.",
      },
      btn: { en: "Explore Temples", hi: "मंदिर देखें", mr: "मंदिर पहा" },
      link: "/temples",
      img: "/herotemple.png",
      alt: {
        en: "Famous Hindu temples of India",
        hi: "भारत के प्रसिद्ध हिंदू मंदिर",
        mr: "भारताची प्रसिद्ध हिंदू मंदिरे",
      },
    },
    {
      title: {
        en: "Book Authentic Puja Online",
        hi: "ऑनलाइन सत्य पूजा बुक करें",
        mr: "ऑनलाइन अस्सल पूजा बुक करा",
      },
      text: {
        en: "Perform Vedic pujas by verified priests for peace, prosperity and blessings.",
        hi: "शांति, समृद्धि और आशीर्वाद के लिए प्रमाणित पुजारियों द्वारा पूजा कराएं।",
        mr: "शांती, समृद्धी व आशीर्वादासाठी प्रमाणित पुजार्‍यांकडून पूजा करून घ्या.",
      },
      btn: { en: "Book Puja", hi: "पूजा बुक करें", mr: "पूजा बुक करा" },
      link: "/pujas",
      img: "/heropuja.png",
      alt: {
        en: "Online puja booking by Hindu priests",
        hi: "हिंदू पुजारियों द्वारा ऑनलाइन पूजा",
        mr: "हिंदू पुजार्‍यांकडून ऑनलाइन पूजा",
      },
    },
    {
      title: {
        en: "Offer Chadhava & Donations",
        hi: "दान और चढ़ावा अर्पित करें",
        mr: "दान व चढावा अर्पण करा",
      },
      text: {
        en: "Support temples, trusts and sacred seva through transparent online donations.",
        hi: "ऑनलाइन दान द्वारा मंदिरों और सेवा कार्यों का सहयोग करें।",
        mr: "ऑनलाइन दानाद्वारे मंदिरे व सेवा उपक्रमांना मदत करा.",
      },
      btn: { en: "Donate Now", hi: "दान करें", mr: "दान करा" },
      link: "/donations",
      img: "/herodonation.png",
      alt: {
        en: "Online temple donation and chadhava",
        hi: "ऑनलाइन मंदिर दान और चढ़ावा",
        mr: "ऑनलाइन मंदिर दान व चढावा",
      },
    },
    {
      title: {
        en: "Buy Spiritual & Puja Products",
        hi: "आध्यात्मिक पूजा सामग्री खरीदें",
        mr: "आध्यात्मिक पूजा साहित्य खरेदी करा",
      },
      text: {
        en: "Shop malas, idols, incense and sacred Hindu spiritual products.",
        hi: "माला, मूर्तियां, धूप और पवित्र पूजा सामग्री खरीदें।",
        mr: "माळा, मूर्ती, अगरबत्ती व पवित्र साहित्य खरेदी करा.",
      },
      btn: { en: "Shop Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" },
      link: "/products",
      img: "/heroproduct.png",
      alt: {
        en: "Hindu spiritual products online",
        hi: "हिंदू आध्यात्मिक उत्पाद",
        mr: "हिंदू आध्यात्मिक उत्पादने",
      },
    },
    {
      title: {
        en: "Aarti, Katha & Bhajan",
        hi: "आरती, कथा और भजन",
        mr: "आरती, कथा आणि भजन",
      },
      text: {
        en: "Read, listen and watch divine aartis, kathas and bhajans online.",
        hi: "आरती, कथा और भजन पढ़ें, सुनें और देखें।",
        mr: "आरती, कथा व भजन वाचा, ऐका आणि पाहा.",
      },
      btn: { en: "View Aarti", hi: "आरती देखें", mr: "आरती पहा" },
      link: "/aarti",
      img: "/heroaarti.png",
      alt: {
        en: "Hindu aarti and katha online",
        hi: "हिंदू आरती और कथा",
        mr: "हिंदू आरती आणि कथा",
      },
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="relative w-full h-[40vh] md:h-[90vh] overflow-hidden"
      aria-label="Hero Section – Devalayaum Spiritual Services"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* HERO IMAGE */}
          <img
            src={s.img}
            alt={s.alt[lang]}
            className="w-full h-full object-cover md:object-contain"
            loading={i === 0 ? "eager" : "lazy"}
          />

          {/* TEXT */}
          <div
            className="
              absolute left-[5%] md:left-[7%]
              top-[75%] -translate-y-[50%]
              md:top-1/2 md:-translate-y-1/2
              w-[90%] md:w-[40%]
              text-left
            "
          >
            <h1 className="text-lg md:text-5xl font-bold text-white drop-shadow-2xl">
              {s.title[lang]}
            </h1>

            <p className="mt-1 md:mt-4 text-xs md:text-xl text-white md:text-gray-200 leading-snug">
              {s.text[lang]}
            </p>

            <Link
              to={s.link}
              className="
                inline-block mt-2 md:mt-6
                px-4 py-1.5 md:px-7 md:py-3
                rounded-full
                text-white text-xs md:text-lg
                bg-gradient-to-r from-[#d58a2d] via-[#e09f3e] to-[#c97a1f]
                shadow-[0_5px_25px_rgba(255,180,80,0.55)]
              "
            >
              {s.btn[lang]}
            </Link>
          </div>
        </div>
      ))}

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              i === current ? "bg-orange-500 scale-125" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
