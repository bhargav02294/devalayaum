// src/components/Footer.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import logo from "../assets/logo.png";
import i18n from "../i18n";

export default function Footer() {
  const [lang, setLang] = useState(i18n.language || "en");

  /* 🔥 Live language update */
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj: Record<string, string>) => obj[lang] || obj.en;

  const text = {
    aboutLine: {
      en: "Devalayaum is a trusted spiritual platform connecting devotees with temples, pujas, chadhava, aartis, kathas, mantras and sacred products across India.",
      hi: "देवलयूम एक विश्वसनीय आध्यात्मिक प्लेटफ़ॉर्म है जो भक्तों को मंदिर, पूजा, चढ़ावा, आरती और पवित्र उत्पादों से जोड़ता है।",
      mr: "देवलयूम हे विश्वासार्ह आध्यात्मिक व्यासपीठ आहे जे भक्तांना मंदिरे, पूजा, चढावा आणि पवित्र वस्तूंशी जोडते.",
      ta: "டெவலையும் பக்தர்களை கோயில்கள், பூஜைகள், காணிக்கைகள் மற்றும் தெய்வீக பொருட்களுடன் இணைக்கும் நம்பகமான ஆன்மீக தளம்.",
      te: "దేవాలయుం భక్తులను దేవాలయాలు, పూజలు, దానాలు మరియు దైవిక ఉత్పత్తులతో అనుసంధానించే విశ్వసనీయ వేదిక.",
      bn: "দেবালায়ুম ভক্তদের মন্দির, পূজা, দান ও পবিত্র পণ্যের সঙ্গে যুক্ত করে।",
    },
    quickLinks: {
      en: "Quick Links",
      hi: "त्वरित लिंक",
      mr: "जलद दुवे",
      ta: "விரைவு இணைப்புகள்",
      te: "త్వరిత లింకులు",
      bn: "দ্রুত লিঙ্ক",
    },
    policies: {
      en: "Policies",
      hi: "नीतियाँ",
      mr: "धोरणे",
      ta: "கொள்கைகள்",
      te: "పాలసీలు",
      bn: "নীতিমালা",
    },
    followUs: {
      en: "Follow Us",
      hi: "हमें फ़ॉलो करें",
      mr: "आम्हाला फॉलो करा",
      ta: "எங்களை பின்தொடரவும்",
      te: "మమ్మల్ని అనుసరించండి",
      bn: "আমাদের অনুসরণ করুন",
    },
    contactUs: {
      en: "Contact Us",
      hi: "संपर्क करें",
      mr: "संपर्क साधा",
      ta: "தொடர்பு கொள்ள",
      te: "మమ్మల్ని సంప్రదించండి",
      bn: "যোগাযোগ করুন",
    },
    dailyUpdates: {
      en: "Daily Spiritual Updates",
      hi: "दैनिक आध्यात्मिक अपडेट",
      mr: "दैनिक आध्यात्मिक अपडेट",
      ta: "தினசரி ஆன்மீக புதுப்பிப்புகள்",
      te: "దైనందిన ఆధ్యాత్మిక అప్డేట్స్",
      bn: "প্রতিদিন আধ্যাত্মিক আপডেট",
    },
    whatsapp: {
      en: "WhatsApp Support: 9 AM – 7 PM (IST)",
      hi: "व्हाट्सऐप सहायता: सुबह 9 – शाम 7",
      mr: "व्हॉट्सॲप समर्थन: सकाळी 9 – संध्याकाळी 7",
      ta: "வாட்ஸ்அப் ஆதரவு: காலை 9 – மாலை 7",
      te: "వాట్సాప్ సహాయం: ఉదయం 9 – సాయంత్రం 7",
      bn: "হোয়াটসঅ্যাপ সহায়তা: সকাল ৯ – সন্ধ্যা ৭",
    },
  };

  return (
    <footer
      className="relative mt-20 bg-gradient-to-b from-[#fff3e0] to-white
                 text-gray-800 pt-14 pb-8 border-t border-orange-200/50"
      aria-label="Website Footer"
    >
      {/* Decorative Divider */}
      <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* BRAND */}
        <div className="text-center mb-14">
          <img
            src={logo}
            alt="Devalayaum – Spiritual Platform Logo"
            className="w-20 h-20 mx-auto rounded-full shadow-xl border-2 border-white"
            loading="lazy"
          />
          <h3 className="mt-3 text-2xl font-bold text-orange-700 font-[Marcellus]">
            Devalayaum
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-sm leading-relaxed font-[Poppins]">
            {t(text.aboutLine)}
          </p>
        </div>

        {/* LINKS GRID */}
        <nav
          className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left"
          aria-label="Footer Navigation"
        >
          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.quickLinks)}
            </h4>
            <ul className="space-y-2 text-sm font-[Poppins]">
              {[
                ["Home", "/"],
                ["Temples", "/temples"],
                ["Pujas", "/pujas"],
                ["Aarti & Katha", "/aarti"],
                ["Chadhava", "/donations"],
                ["Products", "/products"],
              ].map(([label, link]) => (
                <li key={link}>
                  <Link to={link} className="hover:text-orange-700 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* POLICIES */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.policies)}
            </h4>
            <ul className="space-y-2 text-sm font-[Poppins]">
              {[
                ["Terms & Conditions", "/terms"],
                ["Privacy Policy", "/privacy"],
                ["Shipping Policy", "/shipping"],
                ["Cancellation & Refund", "/cancellation-refund"],
              ].map(([label, link]) => (
                <li key={link}>
                  <Link to={link} className="hover:text-orange-700 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.followUs)}
            </h4>
            <div className="flex justify-center md:justify-start gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <Icon
                  key={i}
                  size={22}
                  className="cursor-pointer hover:text-orange-700 transition"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 font-[Poppins]">
              {t(text.dailyUpdates)}
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.contactUs)}
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 font-[Poppins]">
              <li>
                <a
                  href="mailto:devalayaum@gmail.com"
                  className="hover:text-orange-700 transition"
                >
                  devalayaum@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917666210342"
                  className="hover:text-orange-700 transition"
                >
                  +91 76662 10342
                </a>
              </li>
            </ul>
            <p className="text-xs mt-2 text-gray-500 font-[Poppins]">
              {t(text.whatsapp)}
            </p>
          </div>
        </nav>

        {/* COPYRIGHT */}
        <div className="text-center mt-14 pt-5 border-t border-orange-200/60">
          <p className="text-xs md:text-sm text-gray-700 font-[Poppins]">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-orange-700">Devalayaum</span>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
