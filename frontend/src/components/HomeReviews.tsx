// src/components/HomeReviews.tsx
import { useEffect, useState } from "react";
import i18n from "../i18n";

export default function HomeReviews() {
  const [lang, setLang] = useState(i18n.language || "en");

  /* 🔥 Live language update */
  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  /* 🌍 Multilanguage content */
  const text = {
    heading: {
      en: "Devotee Reviews & Testimonials",
      hi: "भक्तों की समीक्षाएँ और अनुभव",
      mr: "भक्तांच्या समीक्षा आणि अनुभव",
      ta: "பக்தர்களின் மதிப்புரைகள் மற்றும் அனுபவங்கள்",
      te: "భక్తుల అభిప్రాయాలు మరియు అనుభవాలు",
      bn: "ভক্তদের রিভিউ ও অভিজ্ঞতা",
    },
    subheading: {
      en: "Real experiences shared by devotees across India",
      hi: "भारत भर के भक्तों द्वारा साझा किए गए वास्तविक अनुभव",
      mr: "संपूर्ण भारतातील भक्तांनी सांगितलेले खरे अनुभव",
      ta: "இந்தியா முழுவதிலிருந்தும் பக்தர்கள் பகிர்ந்த உண்மை அனுபவங்கள்",
      te: "భారతదేశం నలుమూలల నుంచి భక్తులు పంచుకున్న నిజమైన అనుభవాలు",
      bn: "ভারতজুড়ে ভক্তদের শেয়ার করা বাস্তব অভিজ্ঞতা",
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
          en: "This platform brought me closer to peace and devotion. The temple information and puja services are truly divine.",
          hi: "इस प्लेटफ़ॉर्म ने मुझे शांति और भक्ति के और करीब ला दिया। मंदिर और पूजा सेवाएँ सच में दिव्य हैं।",
          mr: "या प्लॅटफॉर्मने मला शांतता आणि भक्तीच्या अधिक जवळ आणले. पूजा सेवा खरोखर दिव्य आहेत.",
          ta: "இந்த தளம் என்னை ஆன்மீக அமைதிக்கும் பக்திக்கும் இன்னும் நெருக்கமாக கொண்டு வந்தது.",
          te: "ఈ ప్లాట్‌ఫామ్ నన్ను ఆధ్యాత్మిక శాంతికి మరింత దగ్గర చేసింది.",
          bn: "এই প্ল্যাটফর্ম আমাকে আধ্যাত্মিক শান্তির আরও কাছে নিয়ে গেছে।",
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
          en: "Extremely trustworthy. My donation safely reached the temple trust. Highly recommended for genuine seva.",
          hi: "बहुत भरोसेमंद। मेरा दान सुरक्षित रूप से मंदिर ट्रस्ट तक पहुँचा।",
          mr: "अत्यंत विश्वासार्ह. माझी देणगी मंदिर ट्रस्टपर्यंत सुरक्षित पोहोचली.",
          ta: "மிகவும் நம்பகமானது. என் நன்கொடை கோவில் அறக்கட்டளையை சென்றடைந்தது.",
          te: "చాలా నమ్మదగినది. నా విరాళం దేవాలయ ట్రస్ట్‌కు చేరింది.",
          bn: "খুবই বিশ্বাসযোগ্য। আমার দান মন্দির ট্রাস্টে পৌঁছেছে।",
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
          en: "A truly divine experience. Booking pujas online was smooth and transparent.",
          hi: "एक दिव्य अनुभव। ऑनलाइन पूजा बुकिंग बहुत आसान और पारदर्शी थी।",
          mr: "खूपच दिव्य अनुभव. ऑनलाइन पूजा बुकिंग अतिशय सोपी होती.",
          ta: "மிகவும் தெய்வீகமான அனுபவம். பூஜை முன்பதிவு மிக எளிதாக இருந்தது.",
          te: "ఒక దివ్య అనుభవం. పూజా బుకింగ్ చాలా సులభంగా జరిగింది.",
          bn: "একটি divine অভিজ্ঞতা। পূজা বুকিং খুব সহজ ছিল।",
        },
      },
    ],
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  /* Duplicate for smooth infinite scroll */
  const infiniteScroll = [...text.reviews, ...text.reviews, ...text.reviews];

  return (
    <section
      className="relative py-32 md:py-44 bg-cover bg-center"
      aria-label="Devotee Reviews and Testimonials"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8E5B8] tracking-wide drop-shadow-lg font-[Marcellus]">
            {t(text.heading)}
          </h2>
          <p className="text-gray-300 mt-3 text-lg md:text-xl font-[Poppins] max-w-3xl mx-auto">
            {t(text.subheading)}
          </p>
        </div>

        {/* SLIDER */}
        <div className="overflow-hidden whitespace-nowrap py-6 md:py-8">
          <div className="animate-scroll-slow inline-flex">
            {infiniteScroll.map((item, index) => (
              <article
                key={index}
                className="w-[260px] sm:w-[320px] md:w-[360px] mx-4
                           bg-white/10 backdrop-blur-md border border-white/20
                           rounded-2xl p-5 text-white shadow-xl
                           hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-gray-200 italic text-sm sm:text-base md:text-lg leading-relaxed mb-6 whitespace-normal">
                  “{t(item.text)}”
                </p>

                <h3 className="text-lg md:text-xl font-semibold text-white font-[Marcellus]">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-300 font-[Poppins]">
                  {t(item.location)}
                </p>
              </article>
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
