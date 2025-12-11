import { useEffect, useState } from "react";
import i18n from "../i18n";

export default function WhyChooseUs() {
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  // Translation helper
  const t = (obj: Record<string, string>) => obj[lang] || obj.en;

  // Headings + Text
  const text = {
    heading: {
      en: "Why Choose Devalayaum?",
      hi: "देवलयूम क्यों चुनें?",
      mr: "देवलयूम का निवडावे?",
      ta: "ஏன் டெவலையும்?",
      te: "ఎందుకు దేవాలయుం?",
      bn: "কেন দেবালায়ুম?",
    },
    subheading: {
      en: "A trusted digital platform bringing temples, pujas, donations and experiences closer to every one",
      hi: "एक विश्वसनीय डिजिटल प्लेटफ़ॉर्म जो मंदिर, पूजा, दान और आध्यात्मिक अनुभव हर भक्त तक पहुँचाता है।",
      mr: "मंदिरे, पूजा, दान आणि आध्यात्मिक अनुभव भक्तांपर्यंत पोहोचवणारे विश्वसनीय व्यासपीठ.",
      ta: "கோயில், பூஜை, காணிக்கை மற்றும் ஆன்மீக அனுபவங்களை உங்களிடம் கொண்டு வரும் நம்பகத்தன்மையான தளம்.",
      te: "దేవాలయాలు, పూజలు, దానాలు మరియు ఆధ్యాత్మిక అనుభవాలను మీకు చేరువ చేసే విశ్వసనీయ వేదిక.",
      bn: "মন্দির, পূজা, দান এবং আধ্যাত্মিক অভিজ্ঞতা আপনাদের কাছে পৌঁছে দেওয়ার বিশ্বস্ত প্ল্যাটফর্ম।",
    },
  };

  // Feature boxes
  const items = [
    {
      title: {
        en: "Verified Temple Partnerships",
        hi: "सत्यापित मंदिर साझेदारी",
        mr: "प्रमाणित मंदिर भागीदारी",
        ta: "சரிபார்க்கப்பட்ட கோவில் இணைப்பு",
        te: "ధృవీకరించబడిన ఆలయ భాగస్వామ్యం",
        bn: "যাচাইকৃত মন্দির অংশীদারিত্ব",
      },
      desc: {
        en: "Every  puja directly connects with authentic temple authorities.",
        hi: "हर दान और पूजा सीधे प्रमाणिक मंदिर प्रशासन से जुड़ी होती है।",
        mr: "प्रत्येक देणगी आणि पूजा थेट प्रमाणित मंदिर अधिकाऱ्यांशी जोडलेली आहे.",
        ta: "ஒவ்வொரு காணிக்கையும் பூஜையும் உண்மையான கோவில் நிர்வாகத்துடன் நேரடியாக இணைக்கப்படுகிறது.",
        te: "ప్రతి దానం మరియు పూజ ప్రత్యక్షంగా ఆలయ అధికారులతో అనుసంధానమై ఉంటుంది.",
        bn: "প্রতিটি দান ও পূজা সরাসরি সত্যিকারের মন্দির কর্তৃপক্ষের সাথে যুক্ত।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png",
    },
    {
      title: {
        en: "Authentic Vedic Pujas",
        hi: "प्रामाणिक वैदिक पूजा",
        mr: "अस्सल वैदिक पूजा",
        ta: "உண்மையான வேத பூஜைகள்",
        te: "ప్రామాణిక వేద పూజలు",
        bn: "আসল বৈদিক পূজা",
      },
      desc: {
        en: "Certified priests perform based on traditional scriptures.",
        hi: "प्रमाणित पुजारी शास्त्रों के अनुसार पूजा करते हैं।",
        mr: "प्रमाणित पुजारी शास्त्रांनुसार पूजा करतात.",
        ta: "சான்றளிக்கப்பட்ட பூஜாரிகள் வேத நூல்களின் படி பூஜை செய்கிறார்கள்.",
        te: "సర్టిఫైడ్ పూజారులు వేద శాస్త్రాల ప్రకారం పూజలు చేస్తారు.",
        bn: "সার্টিফাইড পুরোহিতরা ধর্মগ্রন্থ অনুসারে পূজা করেন।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/17729/17729027.png",
    },
    {
      title: {
        en: "Transparency in Donation",
        hi: "पारदर्शी दान",
        mr: "पारदर्शक देणगी",
        ta: "வெளிப்படையான காணிக்கை",
        te: "పారదర్శక దానాలు",
        bn: "স্বচ্ছ দান",
      },
      desc: {
        en: "Everyone donation is fully traceable and reaches the temple directly.",
        hi: "हर दान ट्रेस किया जा सकता है और सीधे मंदिर तक पहुंचता है।",
        mr: "प्रत्येक देणगी ट्रॅक करण्यायोग्य आणि थेट मंदिरात जाते.",
        ta: "ஒவ்வொரு காணிக்கையும் கண்காணிக்கக்கூடியது மற்றும் கோவிலுக்கு நேரடியாக செல்கிறது.",
        te: "ప్రతి దానం ట్రాక్ చేయవచ్చు మరియు నేరుగా ఆలయానికి చేరుతుంది.",
        bn: "প্রতিটি দান ট্র্যাকযোগ্য এবং সরাসরি মন্দিরে পৌঁছে যায়।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371447.png",
    },
    {
      title: {
        en: "Secure Payments",
        hi: "सुरक्षित भुगतान",
        mr: "सुरक्षित पेमेंट",
        ta: "பாதுகாப்பான கட்டணம்",
        te: "సురక్షిత చెల్లింపులు",
        bn: "নিরাপদ পেমেন্ট",
      },
      desc: {
        en: "Encrypted Razorpay gateway ensures the highest safety.",
        hi: "रेज़रपे एन्क्रिप्शन आपकी भुगतान सुरक्षा सुनिश्चित करता है।",
        mr: "रझरपे एन्क्रिप्शन सुरक्षित पेमेंटची खात्री देते.",
        ta: "Razorpay குறியாக்கப்பட்ட கட்டணம் முழு பாதுகாப்பை அளிக்கிறது.",
        te: "రేజర్‌పే సంకేతీకరణ సురక్షిత చెల్లింపులను అందిస్తుంది.",
        bn: "রেজরপে এনক্রিপ্টেড সুরক্ষিত পেমেন্ট নিশ্চিত করে।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/8984/8984290.png",
    },
    {
      title: {
        en: "Devotee Trust Nationwide",
        hi: "देशभर भक्तों का विश्वास",
        mr: "संपूर्ण देशातील भक्तांचा विश्वास",
        ta: "நாடு முழுவதும் பக்தர்களின் நம்பிக்கை",
        te: "దేశవ్యాప్తంగా భక్తుల విశ్వాసం",
        bn: "সারা দেশের ভক্তদের আস্থা",
      },
      desc: {
        en: "Thousands of users rely on Devalayaum every day.",
        hi: "हजारों भक्त प्रतिदिन हम पर भरोसा करते हैं।",
        mr: "दररोज हजारो भक्त आमच्यावर विश्वास ठेवतात.",
        ta: "தினமும் ஆயிரக்கணக்கான பக்தர்கள் எங்களை நம்புகிறார்கள்.",
        te: "ప్రతిరోజూ వేలాది భక్తులు దేవాలయుం నమ్ముతున్నారు.",
        bn: "প্রতিদিন হাজার হাজার ভক্ত আমাদের উপর নির্ভর করেন।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371076.png",
    },
    {
      title: {
        en: "Multi-Language Content",
        hi: "बहुभाषी आध्यात्मिक सामग्री",
        mr: "बहुभाषिक आध्यात्मिक सामग्री",
        ta: "பல மொழிகளில் ஆன்மீக உள்ளடக்கம்",
        te: "బహుభాషా ఆధ్యాత్మిక కంటెంట్",
        bn: "বহুভাষী আধ্যাত্মিক কন্টেন্ট",
      },
      desc: {
        en: "Aartis, Kathas & Mantras in 6+ regional languages.",
        hi: "आरती, कथा और मंत्र 6+ भाषाओं में उपलब्ध हैं।",
        mr: "आरती, कथा आणि मंत्र 6+ भाषांमध्ये उपलब्ध आहेत.",
        ta: "ஆரத்தி, கதைகள் மற்றும் மந்திரங்கள் 6+ மொழிகளில் கிடைக்கின்றன.",
        te: "ఆర్తులు, కథలు మరియు మంత్రాలు 6+ భాషల్లో లభిస్తాయి.",
        bn: "আরতি, কাথা ও মন্ত্র ৬+ ভাষায় উপলব্ধ।",
      },
      icon: "https://cdn-icons-png.flaticon.com/128/3898/3898082.png",
    },
  ];

  return (
    <section className="relative py-20 bg-black">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/spiritual-bg.jpg')" }}
      />

      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-[Marcellus] font-bold text-[#E7C27C] tracking-wide mb-6">
          {t(text.heading)}
        </h2>

        <p className="text-center text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-14 font-[Poppins]">
          {t(text.subheading)}
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="group bg-black/40 border border-[#A6793D]/60 rounded-2xl p-8 backdrop-blur-md 
                         shadow-xl transition-all duration-500 hover:scale-[1.03] hover:bg-black/50"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={item.icon}
                  alt={t(item.title)}
                  className="h-16 w-16 object-contain opacity-90 group-hover:scale-110 transition-all"
                />
              </div>

              <h3 className="text-2xl text-[#E8C478] font-semibold mb-3 text-center font-[Marcellus]">
                {t(item.title)}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed text-center font-[Poppins]">
                {t(item.desc)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
