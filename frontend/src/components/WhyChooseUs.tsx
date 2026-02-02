// src/components/WhyChooseUs.tsx
import { useEffect, useState } from "react";
import i18n from "../i18n";

export default function WhyChooseUs() {
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj: Record<string, string>) => obj[lang] || obj.en;

  const text = {
    heading: {
      en: "Why Choose Devalayaum for Online Temple Services?",
      hi: "ऑनलाइन मंदिर सेवाओं के लिए देवलयूम क्यों चुनें?",
      mr: "ऑनलाइन मंदिर सेवांसाठी देवलयूम का निवडावे?",
      ta: "ஆன்லைன் கோவில் சேவைகளுக்கு டெவலையும் ஏன் தேர்வு செய்ய வேண்டும்?",
      te: "ఆన్‌లైన్ దేవాలయ సేవల కోసం దేవాలయుం ఎందుకు ఎంచుకోవాలి?",
      bn: "অনলাইন মন্দির পরিষেবার জন্য দেবালায়ুম কেন বেছে নেবেন?",
    },
    subheading: {
      en: "Devalayaum is a trusted digital spiritual platform helping devotees connect with authentic temples, book Vedic pujas, offer donations, and experience divine blessings online.",
      hi: "देवलयूम एक विश्वसनीय डिजिटल आध्यात्मिक प्लेटफ़ॉर्म है जो भक्तों को मंदिर, पूजा और दान से जोड़ता है।",
      mr: "देवलयूम हे विश्वासार्ह डिजिटल आध्यात्मिक व्यासपीठ आहे जे भक्तांना मंदिरे, पूजा आणि देणगीशी जोडते.",
      ta: "டெவலையும் ஒரு நம்பகமான ஆன்மீக தளம், இது பக்தர்களை கோயில்கள், பூஜைகள் மற்றும் காணிக்கைகளுடன் இணைக்கிறது.",
      te: "దేవాలయుం ఒక విశ్వసనీయ ఆధ్యాత్మిక వేదిక, ఇది భక్తులను దేవాలయాలు, పూజలు మరియు దానాలతో అనుసంధానిస్తుంది.",
      bn: "দেবালায়ুম একটি বিশ্বস্ত ডিজিটাল আধ্যাত্মিক প্ল্যাটফর্ম যা ভক্তদের মন্দির, পূজা ও দানের সঙ্গে যুক্ত করে।",
    },
  };

  const items = [
    {
      title: {
        en: "Verified Temple Partnerships",
        hi: "सत्यापित मंदिर साझेदारी",
        mr: "प्रमाणित मंदिर भागीदारी",
        ta: "சரிபார்க்கப்பட்ட கோவில் இணைப்புகள்",
        te: "ధృవీకరించబడిన ఆలయ భాగస్వామ్యాలు",
        bn: "যাচাইকৃত মন্দির অংশীদারিত্ব",
      },
      desc: {
        en: "Every puja booking and temple donation is directly coordinated with authentic temple authorities, ensuring genuine spiritual services.",
        hi: "हर पूजा और दान सीधे प्रमाणिक मंदिर प्रशासन से जुड़ा होता है।",
        mr: "प्रत्येक पूजा आणि देणगी थेट प्रमाणित मंदिर प्रशासनाशी जोडलेली आहे.",
        ta: "ஒவ்வொரு பூஜையும் காணிக்கையும் உண்மையான கோவில் நிர்வாகத்துடன் நேரடியாக இணைக்கப்படுகிறது.",
        te: "ప్రతి పూజ మరియు దానం నేరుగా ఆలయ అధికారులతో అనుసంధానమై ఉంటుంది.",
        bn: "প্রতিটি পূজা ও দান সরাসরি প্রকৃত মন্দির কর্তৃপক্ষের সঙ্গে যুক্ত।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png",
    },
    {
      title: {
        en: "Authentic Vedic Pujas by Priests",
        hi: "प्रामाणिक वैदिक पूजा",
        mr: "अस्सल वैदिक पूजा",
        ta: "உண்மையான வேத பூஜைகள்",
        te: "ప్రామాణిక వేద పూజలు",
        bn: "আসল বৈদিক পূজা",
      },
      desc: {
        en: "Certified Hindu priests perform rituals strictly according to ancient Vedic scriptures for spiritual purity and blessings.",
        hi: "प्रमाणित पुजारी शास्त्रों के अनुसार पूजा करते हैं।",
        mr: "प्रमाणित पुजारी शास्त्रांनुसार विधी करतात.",
        ta: "சான்றளிக்கப்பட்ட பூஜாரிகள் வேத நூல்களின் படி பூஜை செய்கிறார்கள்.",
        te: "సర్టిఫైడ్ పూజారులు వేద శాస్త్రాల ప్రకారం పూజలు చేస్తారు.",
        bn: "সার্টিফাইড পুরোহিতরা ধর্মগ্রন্থ অনুযায়ী পূজা করেন।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/17729/17729027.png",
    },
    {
      title: {
        en: "100% Transparent Temple Donations",
        hi: "पारदर्शी दान",
        mr: "पारदर्शक देणगी",
        ta: "வெளிப்படையான காணிக்கைகள்",
        te: "పారదర్శక దానాలు",
        bn: "স্বচ্ছ দান",
      },
      desc: {
        en: "All temple donations made through Devalayaum are securely processed and directly reach the intended temple trust.",
        hi: "हर दान पूरी तरह ट्रैक किया जा सकता है।",
        mr: "प्रत्येक देणगी पूर्णपणे ट्रॅक करता येते.",
        ta: "ஒவ்வொரு காணிக்கையும் முழுமையாக கண்காணிக்கக்கூடியது.",
        te: "ప్రతి దానం పూర్తిగా ట్రాక్ చేయవచ్చు.",
        bn: "প্রতিটি দান সম্পূর্ণভাবে ট্র্যাকযোগ্য।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371447.png",
    },
    {
      title: {
        en: "Secure & Encrypted Payments",
        hi: "सुरक्षित भुगतान",
        mr: "सुरक्षित पेमेंट",
        ta: "பாதுகாப்பான கட்டணங்கள்",
        te: "సురక్షిత చెల్లింపులు",
        bn: "নিরাপদ পেমেন্ট",
      },
      desc: {
        en: "Advanced encrypted payment gateways ensure safe online transactions for puja bookings, donations, and spiritual purchases.",
        hi: "एन्क्रिप्टेड भुगतान प्रणाली पूर्ण सुरक्षा प्रदान करती है।",
        mr: "एन्क्रिप्टेड पेमेंट प्रणाली संपूर्ण सुरक्षितता देते.",
        ta: "குறியாக்கப்பட்ட கட்டண அமைப்புகள் முழு பாதுகாப்பை வழங்குகின்றன.",
        te: "ఎన్‌క్రిప్టెడ్ చెల్లింపు వ్యవస్థలు పూర్తి భద్రతను అందిస్తాయి.",
        bn: "এনক্রিপ্টেড পেমেন্ট সিস্টেম সম্পূর্ণ নিরাপত্তা নিশ্চিত করে।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/8984/8984290.png",
    },
    {
      title: {
        en: "Trusted by Devotees Across India",
        hi: "देशभर भक्तों का विश्वास",
        mr: "संपूर्ण देशातील भक्तांचा विश्वास",
        ta: "நாடு முழுவதும் பக்தர்களின் நம்பிக்கை",
        te: "దేశవ్యాప్తంగా భక్తుల విశ్వాసం",
        bn: "সারা দেশের ভক্তদের আস্থা",
      },
      desc: {
        en: "Thousands of devotees use Devalayaum daily for temple information, online puja booking and offering sacred donations.",
        hi: "हजारों भक्त प्रतिदिन देवलयूम पर भरोसा करते हैं।",
        mr: "हजारो भक्त दररोज देवलयूमवर विश्वास ठेवतात.",
        ta: "இந்தியா முழுவதும் ஆயிரக்கணக்கான பக்தர்கள் எங்களை நம்புகிறார்கள்.",
        te: "భారతదేశవ్యాప్తంగా వేలాది భక్తులు దేవాలయుం నమ్ముతున్నారు.",
        bn: "ভারতজুড়ে হাজার হাজার ভক্ত আমাদের বিশ্বাস করেন।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371076.png",
    },
    {
      title: {
        en: "Multilingual Devotional Content",
        hi: "बहुभाषी आध्यात्मिक सामग्री",
        mr: "बहुभाषिक आध्यात्मिक सामग्री",
        ta: "பல மொழிகளில் ஆன்மீக உள்ளடக்கம்",
        te: "బహుభాషా ఆధ్యాత్మిక కంటెంట్",
        bn: "বহুভাষী আধ্যাত্মিক কন্টেন্ট",
      },
      desc: {
        en: "Aartis, Kathas, Mantras and temple information are available in multiple Indian languages for wider spiritual reach.",
        hi: "आरती, कथा और मंत्र कई भारतीय भाषाओं में उपलब्ध हैं।",
        mr: "आरती, कथा आणि मंत्र अनेक भारतीय भाषांमध्ये उपलब्ध आहेत.",
        ta: "ஆரத்தி, கதைகள் மற்றும் மந்திரங்கள் பல மொழிகளில் கிடைக்கின்றன.",
        te: "ఆర్తులు, కథలు మరియు మంత్రాలు అనేక భాషల్లో లభిస్తాయి.",
        bn: "আরতি, কথা ও মন্ত্র একাধিক ভাষায় উপলব্ধ।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/3898/3898082.png",
    },
  ];

  return (
    <section
      className="relative py-20 bg-black"
      aria-labelledby="why-choose-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/spiritual-bg.jpg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95" />

      <div className="relative max-w-7xl mx-auto px-6">
        <header className="text-center mb-14">
          <h2
            id="why-choose-heading"
            className="text-4xl md:text-5xl font-[Marcellus] font-bold text-[#E7C27C] tracking-wide mb-6"
          >
            {t(text.heading)}
          </h2>

          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-[Poppins]">
            {t(text.subheading)}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <article
              key={index}
              className="group bg-black/40 border border-[#A6793D]/60 rounded-2xl p-8
                         backdrop-blur-md shadow-xl transition-all duration-500
                         hover:scale-[1.03] hover:bg-black/50"
              aria-label={t(item.title)}
            >
              <div className="flex justify-center mb-6">
                <img
                  src={item.icon}
                  alt={`${t(item.title)} icon`}
                  className="h-16 w-16 object-contain opacity-90 group-hover:scale-110 transition-all"
                  loading="lazy"
                />
              </div>

              <h3 className="text-2xl text-[#E8C478] font-semibold mb-3 text-center font-[Marcellus]">
                {t(item.title)}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed text-center font-[Poppins]">
                {t(item.desc)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
