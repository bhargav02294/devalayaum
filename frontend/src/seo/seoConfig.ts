export type SeoLang = "en" | "hi" | "mr";

interface SeoEntry {
  title: Record<SeoLang, string>;
  description: Record<SeoLang, string>;
  keywords: string;
  ogImage?: string;
}

export const seoConfig: Record<string, SeoEntry> = {
  "/": {
    title: {
      en: "Devalayaum – Online Temples, Pujas, Donations & Aartis",
      hi: "देवलयूम – ऑनलाइन मंदिर, पूजा, दान और आरती",
      mr: "देवलयूम – ऑनलाइन मंदिरे, पूजा, दान आणि आरती",
    },
    description: {
      en: "Discover sacred Hindu temples, book authentic pujas, donate chadhava, read aartis and buy spiritual products online across India.",
      hi: "पवित्र मंदिर खोजें, पूजा बुक करें, दान करें और आरती पढ़ें।",
      mr: "पवित्र मंदिरे शोधा, पूजा बुक करा, दान करा आणि आरती वाचा.",
    },
    keywords:
      "Online Temple Darshan, Puja Booking, Hindu Donation, Chadhava, Aarti, Spiritual Products",
    ogImage: "/og-default.jpg",
  },

  "/temples": {
    title: {
      en: "Sacred Hindu Temples in India | Devalayaum",
      hi: "भारत के पवित्र हिंदू मंदिर | देवलयूम",
      mr: "भारताची पवित्र हिंदू मंदिरे | देवलयूम",
    },
    description: {
      en: "Explore famous Hindu temples, deities, darshan timings, history and spiritual significance.",
      hi: "भारत के प्रसिद्ध हिंदू मंदिरों की जानकारी देखें।",
      mr: "भारताच्या प्रसिद्ध मंदिरांची माहिती पहा.",
    },
    keywords: "Famous Temples India, Hindu Temple Darshan, Mandir Information",
    ogImage: "/og-temples.jpg",
  },

  "/pujas": {
    title: {
      en: "Book Online Hindu Pujas with Verified Priests | Devalayaum",
      hi: "ऑनलाइन हिंदू पूजा बुक करें | देवलयूम",
      mr: "ऑनलाइन हिंदू पूजा बुक करा | देवलयूम",
    },
    description: {
      en: "Book authentic Vedic pujas performed by certified priests for peace, prosperity and spiritual blessings.",
      hi: "प्रमाणित पुजारियों द्वारा वैदिक पूजा बुक करें।",
      mr: "प्रमाणित पुजाऱ्यांकडून वैदिक पूजा बुक करा.",
    },
    keywords: "Online Puja Booking, Vedic Puja Service, Hindu Rituals",
    ogImage: "/og-pujas.jpg",
  },

  "/donations": {
    title: {
      en: "Donate Chadhava to Hindu Temples Online | Devalayaum",
      hi: "मंदिरों में चढ़ावा दान करें | देवलयूम",
      mr: "मंदिरांना चढावा दान करा | देवलयूम",
    },
    description: {
      en: "Offer online temple donations securely to verified Hindu temple trusts and spiritual causes.",
      hi: "सुरक्षित रूप से मंदिरों में चढ़ावा दान करें।",
      mr: "सुरक्षितपणे मंदिरांना चढावा दान करा.",
    },
    keywords: "Temple Donation Online, Chadhava, Hindu Temple Seva",
    ogImage: "/og-donations.jpg",
  },

  "/aartis": {
    title: {
      en: "Hindu Aartis, Kathas & Mantras | Devalayaum",
      hi: "हिंदू आरती, कथा और मंत्र | देवलयूम",
      mr: "हिंदू आरती, कथा आणि मंत्र | देवलयूम",
    },
    description: {
      en: "Read and experience sacred Hindu aartis, kathas and mantras for devotion and peace.",
      hi: "पवित्र आरती, कथा और मंत्र पढ़ें।",
      mr: "पवित्र आरती, कथा आणि मंत्र वाचा.",
    },
    keywords: "Hindu Aarti, Katha, Mantra, Bhajan",
    ogImage: "/og-aartis.jpg",
  },

  "/products": {
    title: {
      en: "Buy Hindu Spiritual Products Online | Devalayaum",
      hi: "हिंदू आध्यात्मिक उत्पाद खरीदें | देवलयूम",
      mr: "हिंदू आध्यात्मिक उत्पादने खरेदी करा | देवलयूम",
    },
    description: {
      en: "Shop malas, idols, incense sticks, diyas and authentic puja products online.",
      hi: "माला, मूर्तियां और पूजा सामग्री ऑनलाइन खरीदें।",
      mr: "माळा, मूर्ती आणि पूजा साहित्य ऑनलाइन खरेदी करा.",
    },
    keywords: "Buy Puja Items Online, Hindu Spiritual Products",
    ogImage: "/og-products.jpg",
  },
};
