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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handler = () => setRender((v) => !v);
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
        hi: "भारत भर के प्राचीन मंदिरों और दिव्य स्थानों का अन्वेषण करें।",
        mr: "भारतातील प्राचीन मंदिरे आणि पवित्र स्थळे शोधा.",
        ta: "இந்தியாவின் பண்டைய கோவில்களையும் தெய்வீக இடங்களையும் பார்க்கவும்.",
        te: "భారతదేశంలోని ప్రాచీన దేవాలయాలను అన్వేషించండి.",
        bn: "ভারতের প্রাচীন মন্দির ও পবিত্র স্থানগুলি অন্বেষণ করুন।",
      },
      btn: {
        en: "Explore Temples",
        hi: "मंदिर देखें",
        mr: "मंदिर पहा",
        ta: "கோயில்களை பார்க்கவும்",
        te: "దేవాలయాలను సందర్శించండి",
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
        ta: "உண்மையான பூஜைகளைப் பதிவு செய்யுங்கள்",
        te: "ప్రామాణిక పూజలను బుక్ చేయండి",
        bn: "আসল পূজা বুক করুন",
      },
      text: {
        en: "Perform rituals done by verified priests.",
        hi: "सत्यापित पुजारियों द्वारा की गई पूजा करें।",
        mr: "प्रमाणित पुजार्‍यांकडून पूजा करून घ्या.",
        ta: "உறுதிப்படுத்தப்பட்ட பூஜாரிகள் செய்யும் பூஜைகள்.",
        te: "ధృవీకరించిన పూజారులు చేసే పూజలు.",
        bn: "যাচাইকৃত পুরোহিতদের দ্বারা সম্পন্ন পূজা।",
      },
      btn: {
        en: "Book Puja",
        hi: "पूजा बुक करें",
        mr: "पूजा बुक करा",
        ta: "பூஜை பதிவு",
        te: "పూజను బుక్ చేయండి",
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
        ta: "நன்கொடை அளித்து ஆதரிக்கவும்",
        te: "దానం చేసి సహకరించండి",
        bn: "দান করে সহায়তা করুন",
      },
      text: {
        en: "Help temples, trusts & seva activities flourish.",
        hi: "मंदिरों, ट्रस्ट और सेवा गतिविधियों को बढ़ने में मदद करें।",
        mr: "मंदिर, ट्रस्ट आणि सेवा उपक्रमांना मदत करा.",
        ta: "கோவில்கள் மற்றும் சேவை நடவடிக்கைகளுக்கு ஆதரவளிக்கவும்.",
        te: "దేవాలయాలు మరియు సేవా కార్యక్రమాలకు సహాయపడండి.",
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
      link: "/donate",
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
        en: "Pure malas, idols & sacred items at your doorstep.",
        hi: "शुद्ध माला, मूर्तियां और पवित्र वस्तुएं आपके घर तक।",
        mr: "शुद्ध माळा, मूर्ती आणि पवित्र वस्तू.",
        ta: "தூய மாலைகள், சிலைகள் மற்றும் பவித்திரப் பொருட்கள்.",
        te: "పవిత్ర మాలలు, విగ్రహాలు మరియు ఆధ్యాత్మిక వస్తువులు.",
        bn: "শুদ্ধ মালা, মূর্তি ও পবিত্র সামগ্রী।",
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
    {
      title: {
        en: "Aarti & Katha",
        hi: "आरती और कथा",
        mr: "आरती आणि कथा",
        ta: "ஆரத்தியும் கதையும்",
        te: "ఆర్తి & కథ",
        bn: "আরতি ও কথা",
      },
      text: {
        en: "Read, listen & watch spiritual Aartis & Kathas.",
        hi: "आध्यात्मिक आरती और कथा पढ़ें, सुनें और देखें।",
        mr: "आध्यात्मिक आरती आणि कथा वाचा, ऐका आणि पाहा.",
        ta: "ஆன்மீக ஆரத்தி மற்றும் கதைகளைக் கேட்டு பாருங்கள்.",
        te: "ఆధ్యాత్మిక ఆర్తులు మరియు కథలు చదవండి, వినండి.",
        bn: "আধ্যাত্মিক আরতি ও কথা পড়ুন, শুনুন, দেখুন।",
      },
      btn: {
        en: "View Aarti",
        hi: "आरती देखें",
        mr: "आरती पहा",
        ta: "ஆரத்தி பார்க்க",
        te: "ఆర్తి చూడండి",
        bn: "আরতি দেখুন",
      },
      link: "/aarti",
      img: "/heroaarti.png",
    },
  ];

  // Auto-slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[85vh] md:h-[100vh] overflow-hidden bg-black">

      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === i ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        >
          {/* FULL-WIDTH IMAGE FIX */}
          <img
            src={s.img}
            alt={s.title[lang]}
            className="w-full h-full object-cover"  /* ⭐ FIXED */
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          {/* Text */}
          <div className="absolute left-6 top-[55%] md:top-[50%] -translate-y-1/2 max-w-[90%] md:max-w-[40%]">

            <h1
              className="text-3xl md:text-6xl font-bold text-white drop-shadow-2xl leading-tight"
              style={{ fontFamily: "'Marcellus', serif" }}
            >
              {s.title[lang]}
            </h1>

            <p
              className="mt-3 text-base md:text-2xl text-gray-200 leading-relaxed drop-shadow-xl"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {s.text[lang]}
            </p>

            <Link
              to={s.link}
              className="inline-block mt-5 px-6 py-2 md:px-8 md:py-3 rounded-full text-white text-base md:text-lg
              bg-gradient-to-r from-[#d58a2d] via-[#e0a03f] to-[#c97a1f]
              hover:brightness-110 transition-all shadow-[0_5px_25px_rgba(255,180,80,0.55)]"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {s.btn[lang]}
            </Link>

          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i
                ? "bg-orange-500 scale-125"
                : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
