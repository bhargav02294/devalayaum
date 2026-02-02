// src/components/HomeReviews.tsx
import { useEffect, useState } from "react";
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
      en: "Devotee Reviews & Testimonials",
      hi: "भक्तों की समीक्षाएँ और अनुभव",
      mr: "भक्तांच्या समीक्षा आणि अनुभव",
      ta: "பக்தர்களின் மதிப்புரைகள் மற்றும் அனுபவங்கள்",
      te: "భక్తుల అభిప్రాయాలు మరియు అనుభవాలు",
      bn: "ভক্তদের রিভিউ ও অভিজ্ঞতা",
    },
    subheading: {
      en: "Real spiritual experiences shared by devotees using our online temple, puja booking and donation services",
      hi: "हमारी ऑनलाइन मंदिर, पूजा बुकिंग और दान सेवाओं का उपयोग करने वाले भक्तों के वास्तविक अनुभव",
      mr: "आमच्या ऑनलाइन मंदिर, पूजा बुकिंग आणि देणगी सेवांचा वापर केलेल्या भक्तांचे खरे अनुभव",
      ta: "எங்கள் ஆன்லைன் கோவில், பூஜை பதிவு மற்றும் நன்கொடை சேவைகளை பயன்படுத்திய பக்தர்களின் உண்மை அனுபவங்கள்",
      te: "మా ఆన్‌లైన్ దేవాలయ, పూజ బుకింగ్ మరియు దానం సేవలను ఉపయోగించిన భక్తుల నిజమైన అనుభవాలు",
      bn: "আমাদের অনলাইন মন্দির, পূজা বুকিং ও দান সেবা ব্যবহার করা ভক্তদের বাস্তব অভিজ্ঞতা",
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
          en: "This spiritual platform brought me closer to peace and devotion. The temple information and online puja services are truly divine.",
          hi: "इस आध्यात्मिक प्लेटफ़ॉर्म ने मुझे शांति और भक्ति के और करीब ला दिया। मंदिर और ऑनलाइन पूजा सेवाएँ सच में दिव्य हैं।",
          mr: "या आध्यात्मिक प्लॅटफॉर्मने मला शांतता आणि भक्तीच्या अधिक जवळ आणले. ऑनलाइन पूजा सेवा खरोखर दिव्य आहेत.",
          ta: "இந்த ஆன்மீக தளம் என்னை அமைதிக்கும் பக்திக்கும் இன்னும் நெருக்கமாக கொண்டு வந்தது.",
          te: "ఈ ఆధ్యాత్మిక వేదిక నన్ను శాంతి మరియు భక్తికి మరింత దగ్గర చేసింది.",
          bn: "এই আধ্যাত্মিক প্ল্যাটফর্ম আমাকে শান্তি ও ভক্তির আরও কাছে নিয়ে গেছে।",
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
          en: "Extremely trustworthy platform. My temple donation safely reached the trust. Highly recommended for genuine Hindu seva.",
          hi: "बहुत भरोसेमंद प्लेटफ़ॉर्म। मेरा मंदिर दान सुरक्षित रूप से ट्रस्ट तक पहुँचा।",
          mr: "अत्यंत विश्वासार्ह प्लॅटफॉर्म. माझी मंदिर देणगी सुरक्षित पोहोचली.",
          ta: "மிகவும் நம்பகமான தளம். என் கோவில் நன்கொடை பாதுகாப்பாக சென்றடைந்தது.",
          te: "చాలా నమ్మదగిన వేదిక. నా దేవాలయ విరాళం సురక్షితంగా చేరింది.",
          bn: "খুবই বিশ্বাসযোগ্য প্ল্যাটফর্ম। আমার মন্দির দান নিরাপদে পৌঁছেছে।",
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
          en: "A truly divine experience. Booking pujas online was smooth, transparent and spiritually fulfilling.",
          hi: "एक दिव्य अनुभव। ऑनलाइन पूजा बुकिंग बहुत आसान और पारदर्शी थी।",
          mr: "खूपच दिव्य अनुभव. ऑनलाइन पूजा बुकिंग अतिशय सोपी होती.",
          ta: "மிகவும் தெய்வீகமான அனுபவம். பூஜை முன்பதிவு மிக எளிதாக இருந்தது.",
          te: "ఒక దివ్య అనుభవం. ఆన్‌లైన్ పూజా బుకింగ్ చాలా సులభంగా జరిగింది.",
          bn: "একটি divine অভিজ্ঞতা। অনলাইন পূজা বুকিং খুব সহজ ছিল।",
        },
      },
    ],
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  const infiniteScroll = [...text.reviews, ...text.reviews, ...text.reviews];

  return (
    <section
      className="relative py-32 md:py-44 bg-cover bg-center"
      aria-label="Devotee testimonials about online temple services, puja booking and donations"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <header className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8E5B8] tracking-wide drop-shadow-lg font-[Marcellus]">
            {t(text.heading)}
          </h2>
          <p className="text-gray-300 mt-3 text-lg md:text-xl font-[Poppins] max-w-3xl mx-auto">
            {t(text.subheading)}
          </p>
        </header>

        <div className="overflow-hidden whitespace-nowrap py-6 md:py-8">
          <div className="animate-scroll-slow inline-flex">
            {infiniteScroll.map((item, index) => (
              <article
                key={index}
                className="w-[260px] sm:w-[320px] md:w-[360px] mx-4
                           bg-white/10 backdrop-blur-md border border-white/20
                           rounded-2xl p-5 text-white shadow-xl
                           hover:shadow-2xl transition-all duration-300"
                aria-label={`Devotee review from ${item.name}`}
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
