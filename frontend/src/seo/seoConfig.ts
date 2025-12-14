export type SeoLang = "en" | "hi" | "mr";

interface SeoEntry {
  title: Record<SeoLang, string>;
  description: Record<SeoLang, string>;
  keywords: string;
}

export const seoConfig: Record<string, SeoEntry> = {
  "/": {
    title: {
      en: "Devalayaum – Temples, Pujas, Donations & Aartis",
      hi: "देवलयूम – मंदिर, पूजा, दान और आरती",
      mr: "देवलयूम – मंदिरे, पूजा, दान आणि आरती",
    },
    description: {
      en: "Discover sacred temples, book authentic pujas, donate chadhava, read aartis and explore spiritual products across India.",
      hi: "भारत भर के पवित्र मंदिर खोजें, पूजा बुक करें और दान करें।",
      mr: "भारतभर पवित्र मंदिरे शोधा, पूजा बुक करा आणि दान करा.",
    },
    keywords:
      "Hindu Temples, Online Puja Booking, Chadhava Donation, Aarti, Katha, Mantra",
  },

  "/temples": {
    title: {
      en: "Sacred Hindu Temples in India | Devalayaum",
      hi: "भारत के पवित्र मंदिर | देवलयूम",
      mr: "भारताची पवित्र मंदिरे | देवलयूम",
    },
    description: {
      en: "Explore sacred Hindu temples, history, deities, rituals and darshan timings.",
      hi: "भारत के प्रसिद्ध हिंदू मंदिरों का विवरण देखें।",
      mr: "भारताच्या प्रसिद्ध मंदिरांची माहिती पहा.",
    },
    keywords: "Hindu Temples, Famous Indian Temples, Darshan Timings",
  },

  "/pujas": {
    title: {
      en: "Book Online Pujas with Verified Priests | Devalayaum",
      hi: "ऑनलाइन पूजा बुक करें | देवलयूम",
      mr: "ऑनलाइन पूजा बुक करा | देवलयूम",
    },
    description: {
      en: "Book authentic Vedic pujas performed by certified priests at temples.",
      hi: "प्रामाणिक वैदिक पूजा बुक करें।",
      mr: "प्रमाणित पुजाऱ्यांकडून पूजा बुक करा.",
    },
    keywords: "Online Puja Booking, Vedic Puja, Temple Rituals",
  },

  "/donations": {
    title: {
      en: "Donate Chadhava to Temples | Devalayaum",
      hi: "मंदिरों में चढ़ावा दान करें | देवलयूम",
      mr: "मंदिरांना चढावा दान करा | देवलयूम",
    },
    description: {
      en: "Donate chadhava securely to verified temple trusts and causes.",
      hi: "सुरक्षित रूप से मंदिरों में दान करें।",
      mr: "सुरक्षितपणे मंदिरांना दान करा.",
    },
    keywords: "Temple Donation, Chadhava, Hindu Donation",
  },

  // ➕ Continue for all your pages
};
