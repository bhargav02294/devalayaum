import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import i18n from "../i18n";

export default function Footer() {
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj: Record<string, string>) => obj[lang] || obj["en"];

  const text = {
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
      mr: "आमच्याशी संपर्क साधा",
      ta: "எங்களை தொடர்பு கொள்ள",
      te: "మమ్మల్ని సంప్రదించండి",
      bn: "যোগাযোগ করুন",
    },
    aboutLine: {
      en: "Your trusted spiritual platform for Temples, Pujas, Donations, Aartis, and Divine Products.",
      hi: "मंदिर, पूजा, दान, आरती और पवित्र उत्पादों के लिए आपका विश्वसनीय आध्यात्मिक प्लेटफ़ॉर्म।",
      mr: "मंदिरे, पूजा, दान, आरती आणि पवित्र वस्तूंसाठी तुमचा विश्वासार्ह आध्यात्मिक प्लॅटफॉर्म.",
      ta: "கோயில்கள், பூஜைகள், தானங்கள், ஆரத்தி மற்றும் தெய்வீக பொருட்களுக்கான உங்கள் நம்பகமான ஆன்மீக தளம்.",
      te: "దేవాలయాలు, పూజలు, దానాలు, ఆర్తులు, దైవిక ఉత్పత్తుల కోసం మీ నమ్మదగిన ఆధ్యాత్మిక వేదిక.",
      bn: "মন্দির, পূজা, দান, আরতি ও পবিত্র পণ্যের জন্য আপনার বিশ্বস্ত আধ্যাত্মিক প্ল্যাটফর্ম।",
    },
    dailyUpdates: {
      en: "Daily spiritual updates",
      hi: "दैनिक आध्यात्मिक अपडेट",
      mr: "दैनिक आध्यात्मिक अपडेट",
      ta: "தினசரி ஆன்மீக புதுப்பிப்பு",
      te: "దైనందిన ఆధ్యాత్మిక అప్డేట్స్",
      bn: "প্রতিদিন আধ্যাত্মিক আপডেট",
    },
    whatsapp: {
      en: "WhatsApp Support: 9 AM – 7 PM",
      hi: "व्हाट्सऐप सहायता: सुबह 9 से शाम 7 बजे तक",
      mr: "व्हाट्सअॅप समर्थन: सकाळी 9 ते संध्याकाळी 7",
      ta: "வாட்ஸ்அப் ஆதரவு: காலை 9 – மாலை 7",
      te: "వాట్సాప్ సహాయం: ఉదయం 9 – సాయంత్రం 7",
      bn: "হোয়াটসঅ্যাপ সহায়তা: সকাল ৯ – সন্ধ্যা ৭",
    },
  };

  return (
    <footer
      className="relative mt-20 bg-gradient-to-b from-[#fff3e0] to-white 
                 text-gray-800 pt-14 pb-8 border-t border-orange-200/50"
    >
      {/* Glow Divider */}
      <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">

        {/* LOGO + ABOUT */}
        <div className="text-center mb-12">
          <img
            src={logo}
            alt="Devalayaum Logo"
            className="w-20 h-20 mx-auto rounded-full shadow-xl border-2 border-white"
          />
          <h3 className="mt-3 text-2xl font-bold text-orange-700 tracking-wide font-[Marcellus]">
            Devalayaum
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mt-2 text-sm font-[Poppins] leading-relaxed">
            {t(text.aboutLine)}
          </p>
        </div>

        {/* MAIN FOUR COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.quickLinks)}
            </h4>
            <ul className="space-y-2 text-sm font-[Poppins]">
              {[
                [{ en: "Home" }, "/"],
                [{ en: "Temples" }, "/temples"],
                [{ en: "Pujas" }, "/pujas"],
                [{ en: "Aarti / Katha" }, "/aarti"],
                [{ en: "Chadhava" }, "/donations"],
                [{ en: "Products" }, "/products"],
              ].map(([label, link]) => (
                <li key={link as string}>
                  <Link
                    to={link as string}
                    className="hover:text-orange-700 transition"
                  >
                    {t(label as Record<string, string>)}
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
            <div className="flex justify-center md:justify-start gap-4 text-gray-700">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <Icon
                  key={i}
                  className="cursor-pointer hover:text-orange-700 transition"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-[Poppins]">
              {t(text.dailyUpdates)}
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3 font-[Marcellus]">
              {t(text.contactUs)}
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 font-[Poppins]">
              <li>devalayaum@gmail.com</li>
              <li>+91 76662 10342</li>
            </ul>
            
          </div>
          <p className="text-xs mt-2 text-gray-500 font-[Poppins]">
              {t(text.whatsapp)}
            </p>

        </div>

        {/* BOTTOM AREA */}
        <div className="text-center mt-12 pt-5 border-t border-orange-200/60">
          <p className="text-xs md:text-sm text-gray-700 font-[Poppins]">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-orange-700">Devalayaum</span>.  
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
