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
    const handler = () => setRender(v => !v);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const slides: Slide[] = [
    {
      title: { en: "Discover Sacred Temples", hi: "पवित्र मंदिरों की खोज करें", mr:"पवित्र मंदिर शोधा", ta:"புனித கோயில்களை கண்டறியவும்", te:"పవిత్ర దేవాలయాలను కనుగొనండి", bn:"পবিত্র মন্দির আবিষ্কার করুন" },
      text: { en: "Explore ancient temples & divine places across India.", hi:"भारत भर के प्राचीन मंदिरों और दिव्य स्थानों का अन्वेषण करें।", mr:"भारतातील प्राचीन मंदिरे आणि पवित्र स्थळे शोधा.", ta:"இந்தியாவின் பண்டைய...", te:"భారతదేశంలోని ప్రాచీన...", bn:"ভারতের প্রাচীন..." },
      btn: { en:"Explore Temples", hi:"मंदिर देखें", mr:"मंदिर पहा", ta:"கோயில்களை பார்க்கவும்", te:"దేవాలయాలను సందర్శించండి", bn:"মন্দির দেখুন" },
      link: "/temples",
      img: "/herotemple.png"
    },
    {
      title: { en: "Book Authentic Pujas", hi:"सत्य पूजा बुक करें", mr:"अस्सल पूजा बुक करा", ta:"உண்மையான பூஜைகளைப் பதிவு...", te:"ప్రామాణిక పూజలను బుక్...", bn:"আসল পূজা বুক..." },
      text: { en:"Perform rituals done by verified priests.", hi:"सत्यापित पुजारियों...", mr:"प्रमाणित पुजार्‍यांकडून...", ta:"உறுதிப்படுத்தப்பட்ட...", te:"ధృవీకరించిన పూజారులు...", bn:"যাচাইকৃত পুরোহিত..." },
      btn: { en:"Book Puja", hi:"पूजा बुक करें", mr:"पूजा बुक करा", ta:"பூஜை பதிவு", te:"పూజను బుక్ చేయండి", bn:"পূজা বুক করুন" },
      link: "/pujas",
      img: "/heropuja.png"
    },
    {
      title: { en:"Support with Donation", hi:"दान से सहयोग करें", mr:"दानाने मदत करा", ta:"நன்கொடை அளித்து...", te:"దానం చేసి సహకరించండి", bn:"দান করে সহায়তা..." },
      text: { en:"Help temples, trusts & seva activities flourish.", hi:"मंदिरों, ट्रस्ट...", mr:"मंदिर, ट्रस्ट...", ta:"கோவில்கள் மற்றும்...", te:"దేవాలయాలు మరియు...", bn:"মন্দির ও সেবামূলক..." },
      btn: { en:"Donate Now", hi:"दान करें", mr:"दान करा", ta:"நன்கொடை அளிக்கவும்", te:"ఇప్పుడే దానం చేయండి", bn:"এখনই দান করুন" },
      link: "/donate",
      img: "/herodonation.png"
    },
    {
      title: { en:"Spiritual Products", hi:"आध्यात्मिक उत्पाद", mr:"आध्यात्मिक उत्पादने", ta:"ஆன்மீகப் பொருட்கள்", te:"ఆధ్యాత్మిక ఉత్పత్తులు", bn:"আধ্যাত্মিক পণ্য" },
      text: { en:"Pure malas, idols & sacred items at your doorstep.", hi:"शुद्ध माला...", mr:"शुद्ध माळा...", ta:"தூய மாலைகள்...", te:"పవిత్ర మాలలు...", bn:"শুদ্ধ মালা..." },
      btn: { en:"Shop Now", hi:"अभी खरीदें", mr:"आता खरेदी करा", ta:"இப்போது வாங்கவும்", te:"ఇప్పుడు కొనండి", bn:"এখনই কিনুন" },
      link: "/products",
      img: "/heroproduct.png"
    },
    {
      title: { en:"Aarti & Katha", hi:"आरती और कथा", mr:"आरती आणि कथा", ta:"ஆரத்தியும் கதையும்", te:"ఆర్తి & కథ", bn:"আরতি ও কথা" },
      text: { en:"Read, listen & watch spiritual Aartis & Kathas.", hi:"आध्यात्मिक आरती...", mr:"आध्यात्मिक आरती...", ta:"ஆன்மீக ஆரத்தி...", te:"ఆధ్యాత్మిక ఆర్తులు...", bn:"আধ্যাত্মিক আরতি..." },
      btn: { en:"View Aarti", hi:"आरती देखें", mr:"आरती पहा", ta:"ஆரத்தி பார்க்க", te:"ఆర్తి చూడండి", bn:"আরতি দেখুন" },
      link: "/aarti",
      img: "/heroaarti.png"
    }
  ];

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(p => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[35vh] md:h-[75vh] overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === i ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        >
          {/* IMAGE – full visibility, no crop */}
          <div className="w-full h-full flex items-center justify-center bg-black">
            <img
              src={s.img}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Text */}
          <div className="absolute top-1/2 left-6 -translate-y-1/2 max-w-[80%] md:max-w-[40%]">
            <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-2xl font-[Marcellus]">
              {s.title[lang]}
            </h1>

            <p className="mt-3 text-sm md:text-xl text-gray-200 font-[Merriweather]">
              {s.text[lang]}
            </p>

            <Link
              to={s.link}
              className="inline-block mt-5 px-5 py-2 md:px-8 md:py-3 text-sm md:text-lg rounded-full text-white
              bg-gradient-to-r from-[#d58a2d] via-[#e0a03f] to-[#c97a1f]
              hover:brightness-110 transition-all shadow-[0_5px_25px_rgba(255,180,80,0.55)]"
            >
              {s.btn[lang]}
            </Link>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              current === i ? "bg-orange-500 scale-125" : "bg-white/60 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
