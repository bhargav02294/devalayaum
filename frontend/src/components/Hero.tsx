// src/components/Hero.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import i18n from "../i18n";

type LangCode = "en" | "hi" | "mr" | "ta" | "te" | "bn";
type LangText = Record<LangCode, string>;

interface Slide {
  title: LangText;
  text: LangText;
  btn: LangText;
  link: string;
  img: string;
}

export default function Hero() {
  const lang = (i18n.language || "en") as LangCode;
  const [, forceRerender] = useState(false);

  useEffect(() => {
    const handler = () => forceRerender((v) => !v);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const slides: Slide[] = [
    {
      title: {
        en: "Discover Sacred Temples",
        hi: "पवित्र मंदिरों की खोज करें",
        mr: "पवित्र मंदिर शोधा",
        ta: "புனித கோயில்களை கண்டறியவும்",
        te: "పవిత్ర దేవాలయాలను కనుగొనండి",
        bn: "পবিত্র মন্দির আবিষ্কার করুন",
      },
      text: {
        en: "Explore ancient temples & divine places across India.",
        hi: "भारत के प्राचीन मंदिरों और दिव्य स्थलों का अन्वेषण करें।",
        mr: "भारतातील प्राचीन मंदिरे आणि पवित्र स्थळे शोधा.",
        ta: "பண்டைய கோவில்களை இந்தியா முழுவதும் காணலாம்.",
        te: "భారతదేశంలోని ప్రాచీన దేవాలయాలను అన్వేషించండి.",
        bn: "ভারতের প্রাচীন মন্দিরগুলিকে অন্বেষণ করুন।",
      },
      btn: {
        en: "Explore Temples",
        hi: "मंदिर देखें",
        mr: "मंदिर पहा",
        ta: "கோயில்களை பார்க்கவும்",
        te: "దేవాలయాలను చూడండి",
        bn: "মন্দির দেখুন",
      },
      link: "/temples",
      img: "/herotemple.png",
    },

    {
      title: {
        en: "Book Authentic Pujas",
        hi: "सत्य पूजा बुक करें",
        mr: "अस्सल पूजा बुक करा",
        ta: "உண்மையான பூஜைகளைக் பதிவு செய்யுங்கள்",
        te: "ప్రామాణిక పూజలను బుక్ చేయండి",
        bn: "আসল পূজা বুক করুন",
      },
      text: {
        en: "Rituals performed by verified priests.",
        hi: "सत्यापित पुजारियों द्वारा पूजा।",
        mr: "प्रमाणित पुजार्‍यांकडून पूजा.",
        ta: "சான்றளிக்கப்பட்ட பூஜாரிகள் செய்யும் பூஜை.",
        te: "ధృవీకరించిన పూజారులు చేసే పూజలు.",
        bn: "যাচাইকৃত পুরোহিতদের দ্বারা করা পূজা।",
      },
      btn: {
        en: "Book Puja",
        hi: "पूजा बुक करें",
        mr: "पूजा बुक करा",
        ta: "பூஜை பதிவு",
        te: "పూజ బుక్ చేయండి",
        bn: "পূজা বুক করুন",
      },
      link: "/pujas",
      img: "/heropuja.png",
    },

    {
      title: {
        en: "Support with Donation",
        hi: "दान से सहयोग करें",
        mr: "दानाने मदत करा",
        ta: "நன்கொடை அளித்து உதவுங்கள்",
        te: "దానం చేసి సహాయం చేయండి",
        bn: "দান করে সহায়তা করুন",
      },
      text: {
        en: "Help temples & seva activities flourish.",
        hi: "मंदिर और सेवा गतिविधियों को बढ़ावा दें।",
        mr: "मंदिरे आणि सेवा उपक्रमांना मदत करा.",
        ta: "கோவில்களும் சேவைகளும் முன்னேற உதவுங்கள்.",
        te: "దేవాలయాలు మరియు సేవా కార్యక్రమాలను ప్రోత్సహించండి.",
        bn: "মন্দির ও সেবামূলক কার্যক্রমকে সমর্থন করুন।",
      },
      btn: {
        en: "Donate Now",
        hi: "दान करें",
        mr: "दान करा",
        ta: "நன்கொடை அளிக்கவும்",
        te: "ఇప్పుడే దానం చేయండి",
        bn: "এখনই দান করুন",
      },
      link: "/donations",
      img: "/herodonation.png",
    },

    {
      title: {
        en: "Spiritual Products",
        hi: "आध्यात्मिक उत्पाद",
        mr: "आध्यात्मिक उत्पादने",
        ta: "ஆன்மீகப் பொருட்கள்",
        te: "ఆధ్యాత్మిక ఉత్పత్తులు",
        bn: "আধ্যাত্মিক পণ্য",
      },
      text: {
        en: "Pure malas, idols & pooja items.",
        hi: "शुद्ध माला, मूर्तियां और पूजा सामग्री।",
        mr: "शुद्ध माळा, मूर्ती आणि पूजा साहित्य.",
        ta: "தூய மாலைகள், சிலைகள் மற்றும் பூஜை பொருட்கள்.",
        te: "పవిత్ర మాలలు, విగ్రహాలు మరియు పూజా వస్తువులు.",
        bn: "শুদ্ধ মালা, মূর্তি ও পূজা সামগ্রী।",
      },
      btn: {
        en: "Shop Now",
        hi: "अभी खरीदें",
        mr: "आता खरेदी करा",
        ta: "இப்போது வாங்கவும்",
        te: "ఇప్పుడు కొనండి",
        bn: "এখনই কিনুন",
      },
      link: "/products",
      img: "/heroproduct.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[85vh] md:h-[92vh] overflow-hidden">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.img}
            alt={slide.title[lang]}
            className="w-full h-full object-cover brightness-[0.65]"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>

          {/* TEXT AREA */}
          <div
            className="
              absolute top-1/2 -translate-y-1/2 
              left-[5%] md:left-[8%] 
              max-w-[85%] md:max-w-[42%]
            "
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight font-[Marcellus] drop-shadow-2xl">
              {slide.title[lang]}
            </h1>

            <p className="mt-4 text-lg md:text-2xl text-gray-200 leading-relaxed font-[Merriweather]">
              {slide.text[lang]}
            </p>

            <Link
              to={slide.link}
              className="
                inline-block mt-6 px-8 py-3 md:px-10 md:py-4
                rounded-full text-white text-lg md:text-xl
                bg-gradient-to-r from-orange-600 to-yellow-500
                shadow-[0_5px_35px_rgba(255,180,80,0.55)]
                hover:scale-[1.05] transition-all font-[Merriweather]
              "
            >
              {slide.btn[lang]}
            </Link>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i ? "bg-orange-500 scale-125" : "bg-white/50 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
