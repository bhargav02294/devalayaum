import React, { useEffect, useState } from "react";
import i18n from "../i18n";

export default function HomeReviews() {
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const text = {
    heading: {
      en: " Reviews",
      hi: "भक्तों की समीक्षा",
      mr: "भक्तांची मते",
      ta: "பக்தர்களின் மதிப்புரைகள்",
      te: "భక్తుల అభిప్రాయాలు",
      bn: "ভক্তদের রিভিউ",
    },
    subheading: {
      en: "Words from our beloved ones",
      hi: "हमारे प्रिय भक्तों की बातें",
      mr: "आमच्या प्रिय भक्तांचे शब्द",
      ta: "எங்கள் அன்பான பக்தர்களின் வார்த்தைகள்",
      te: "మా ప్రియమైన భక్తుల మాటలు",
      bn: "আমাদের প্রিয় ভক্তদের কথা",
    },
    reviews: [
      {
        name: "Ravi Sharma",
        location: {
          en: "Delhi",
          hi: "दिल्ली",
          mr: "दिल्ली",
          ta: "டெல்லி",
          te: "ఢిల్లీ",
          bn: "দিল্লি",
        },
        text: {
          en: "This platform brought me closer to peace.",
          hi: "इस प्लेटफ़ॉर्म ने मुझे आध्यात्मिक शांति के करीब ला दिया।",
          mr: "या प्लॅटफॉर्मने मला आध्यात्मिक शांततेजवळ आणले.",
          ta: "இந்த தளம் எனக்கு ஆன்மீக அமைதியைக் கொண்டு வந்தது.",
          te: "ఈ ప్లాట్‌ఫామ్ నాకు ఆధ్యాత్మిక శాంతికి దగ్గర చేసింది.",
          bn: "এই প্ল্যাটফর্ম আমাকে আধ্যাত্মিক শান্তির আরও কাছে এনেছে।",
        },
      },
      {
        name: "Meena Deshpande",
        location: {
          en: "Pune",
          hi: "पुणे",
          mr: "पुणे",
          ta: "புனே",
          te: "పూణే",
          bn: "পুণে",
        },
        text: {
          en: "Very trustworthy, reached temple trusts.",
          hi: "बहुत भरोसेमंद, दान मंदिर ट्रस्ट तक पहुँचा।",
          mr: "अत्यंत विश्वासार्ह, देणगी मंदिर ट्रस्टपर्यंत पोहोचली.",
          ta: "மிகவும் நம்பகமானது, நன்கொடைகள் கோவில் அறக்கட்டளைக்கு சென்றன.",
          te: "నమ్మదగినది, విరాళాలు దేవాలయ ట్రస్ట్‌లకు చేరాయి.",
          bn: "খুবই বিশ্বাসযোগ্য, দান মন্দির ট্রাস্টে পৌঁছেছে।",
        },
      },
      {
        name: "Anil Kumar",
        location: {
          en: "Hyderabad",
          hi: "हैदराबाद",
          mr: "हैदराबाद",
          ta: "ஹைதராபாத்",
          te: "హైదరాబాద్",
          bn: "হায়দ্রাবাদ",
        },
        text: {
          en: "A divine experience. Puja booking was very smooth.",
          hi: "एक दिव्य अनुभव। पूजा बुकिंग बहुत आसान थी।",
          mr: "एक दिव्य अनुभव. पूजा बुकिंग खूपच सोपी होती.",
          ta: "ஒரு தெய்வீக அனுபவம். பூஜை முன்பதிவு மிகவும் மென்மையானது.",
          te: "ఒక దివ్య అనుభవం. పూజా బుకింగ్ చాలా సులభంగా జరిగింది.",
          bn: "একটি divine অভিজ্ঞতা। পূজা বুকিং খুব smooth ছিল।",
        },
      },
    ],
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj["en"];

  const infiniteScroll = [...text.reviews, ...text.reviews, ...text.reviews];

  return (
    <section
      className="relative py-32 md:py-44 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8E5B8] tracking-wide drop-shadow-lg font-[Marcellus]">
            {t(text.heading)}
          </h2>
          <p className="text-gray-300 mt-3 text-lg md:text-xl font-[Poppins]">
            {t(text.subheading)}
          </p>
        </div>

        {/* Auto Slider */}
        <div className="overflow-hidden whitespace-nowrap py-6 md:py-8">
          <div className="animate-scroll-slow inline-flex">
            {infiniteScroll.map((item, index) => (
              <div
                key={index}
                className="w-[260px] sm:w-[320px] md:w-[360px] mx-4 bg-white/10 
                backdrop-blur-md border border-white/20 rounded-2xl p-5 
                text-white shadow-xl hover:shadow-2xl transition-all duration-300 
                overflow-hidden"
              >
                <p className="text-gray-200 italic text-sm sm:text-base md:text-lg leading-relaxed 
                  mb-6 whitespace-normal break-words">
                  “{t(item.text)}”
                </p>

                <h3 className="text-lg md:text-xl font-semibold text-white font-[Marcellus]">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-300 font-[Poppins]">
                  {t(item.location)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Animation */}
        <style>{`
          @keyframes scroll-slow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-slow {
            animation: scroll-slow 25s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
