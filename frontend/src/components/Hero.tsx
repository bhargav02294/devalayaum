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
      title: { en: "Discover Sacred Temples", hi: "पवित्र मंदिरों की खोज करें", mr: "पवित्र मंदिर शोधा" },
      text: {
        en: "Explore ancient temples & divine places across India.",
        hi: "भारत भर के प्राचीन मंदिरों और दिव्य स्थानों का अन्वेषण करें।",
        mr: "प्राचीन मंदिरे आणि पवित्र स्थळे शोधा.",
      },
      btn: { en: "Explore Temples", hi: "मंदिर देखें", mr: "मंदिर पहा" },
      link: "/temples",
      img: "/herotemple.png",
    },
    {
      title: { en: "Book Authentic Pujas", hi: "सत्य पूजा बुक करें", mr: "अस्सल पूजा बुक करा" },
      text: {
        en: "Perform rituals done by verified priests.",
        hi: "सत्यापित पुजारियों द्वारा की गई पूजा करें।",
        mr: "प्रमाणित पुजार्‍यांकडून पूजा करून घ्या.",
      },
      btn: { en: "Book Puja", hi: "पूजा बुक करें", mr: "पूजा बुक करा" },
      link: "/pujas",
      img: "/heropuja.png",
    },
    {
      title: { en: "Support Us with Donation", hi: "दान से सहयोग करें", mr: "दानाने मदत करा" },
      text: {
        en: "Help temples, trusts & seva activities flourish.",
        hi: "मंदिरों और सेवा गतिविधियों को बढ़ने में मदद करें।",
        mr: "मंदिर आणि सेवा उपक्रमांना मदत करा.",
      },
      btn: { en: "Discover Now", hi: "दान करें", mr: "दान करा" },
      link: "/donate",
      img: "/herodonation.png",
    },
    {
      title: { en: "Spiritual Products", hi: "आध्यात्मिक उत्पाद", mr: "आध्यात्मिक उत्पादने" },
      text: {
        en: "Pure malas, idols & sacred items.",
        hi: "शुद्ध माला, मूर्तियां और पवित्र वस्तुएं।",
        mr: "शुद्ध माळा, मूर्ती आणि पवित्र वस्तू.",
      },
      btn: { en: "Shop Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" },
      link: "/products",
      img: "/heroproduct.png",
    },
    {
      title: { en: "Aarti & Katha", hi: "आरती और कथा", mr: "आरती आणि कथा" },
      text: {
        en: "Read, listen & watch Spiritual Aartis & Kathas.",
        hi: "आध्यात्मिक आरती और कथा पढ़ें, सुनें और देखें।",
        mr: "आरती आणि कथा वाचा, ऐका आणि पाहा.",
      },
      btn: { en: "View Aarti", hi: "आरती देखें", mr: "आरती पहा" },
      link: "/aarti",
      img: "/heroaarti.png",
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
    <div
      className="
        relative w-full 
        h-[40vh] md:h-[90vh]    /* MOBILE SMALLER, PC SAME */
        overflow-hidden 
        mt-0 p-0
      "
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >

          {/* FULL IMAGE */}
          <img
            src={s.img}
            alt={s.title[lang]}
            className="
              w-full h-full 
              object-cover md:object-contain
            "
          />

          {/* TEXT ON IMAGE */}
          <div
            className="
              absolute
              left-[5%] md:left-[7%]
              
              /* MOBILE → LOWER */
              top-[75%]
              -translate-y-[50%]

              /* PC → CENTERED PERFECTLY */
              md:top-1/2 md:-translate-y-1/2

              w-[90%] md:w-[40%]
              text-left
            "
          >
            <h1
              className="
                text-lg md:text-5xl     /* MOBILE SMALLER */
                font-bold 
                text-white
                drop-shadow-2xl
              "
            >
              {s.title[lang]}
            </h1>

            <p
              className="
                mt-1 md:mt-4
                text-xs md:text-xl 
                text-white md:text-gray-200
                leading-snug
              "
            >
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

      {/* INDICATORS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              i === current ? "bg-orange-500 scale-125" : "bg-white/60"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
