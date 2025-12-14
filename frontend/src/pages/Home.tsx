// src/pages/Home.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  /* 🔥 SEO META UPDATE (Multilanguage) */
  useEffect(() => {
    const seo = {
      en: {
        title:
          "Devalayaum – Temples, Pujas, Chadhava, Aarti & Spiritual Products in India",
        desc:
          "Devalayaum connects devotees with sacred temples, authentic pujas, verified donations, aartis, kathas, mantras and divine spiritual products across India.",
      },
      hi: {
        title:
          "देवलयूम – मंदिर, पूजा, चढ़ावा, आरती और आध्यात्मिक उत्पाद",
        desc:
          "देवलयूम भक्तों को मंदिरों, प्रामाणिक पूजा, सत्यापित दान, आरती और पवित्र उत्पादों से जोड़ता है।",
      },
      mr: {
        title:
          "देवलयूम – मंदिरे, पूजा, चढावा, आरती आणि आध्यात्मिक उत्पादने",
        desc:
          "देवलयूम भक्तांना मंदिरे, प्रामाणिक पूजा, चढावा, आरती आणि पवित्र वस्तूंशी जोडते.",
      },
    };

    const meta = seo[lang as "en" | "hi" | "mr"] || seo.en;

    document.title = meta.title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", meta.desc);
    setMeta(
      "keywords",
      "Hindu Temples, Online Puja Booking, Chadhava Donation, Aarti, Katha, Mantra, Spiritual Products, Indian Temples"
    );

    setProperty("og:title", meta.title);
    setProperty("og:description", meta.desc);
    setProperty("og:type", "website");
    setProperty("og:url", "https://devalayaum.com");
    setProperty(
      "og:image",
      "https://devalayaum.com/seo-banner.jpg"
    );

    setProperty("twitter:card", "summary_large_image");
    setProperty("twitter:title", meta.title);
    setProperty("twitter:description", meta.desc);
  }, [lang]);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-orange-100 via-white to-white pt-24 pb-16 text-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-orange-700 mb-4 leading-tight">
            {t("title")}
          </h1>

          <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("tagline")}
          </p>

          <a
            href="#donate"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:bg-orange-700 transition"
            aria-label="Donate to sacred temple causes"
          >
            {t("button")}
          </a>
        </div>

        {/* HERO IMAGE */}
        <div className="mt-12 flex justify-center">
          <img
            src="https://res.cloudinary.com/demo/image/upload/v1727456000/temple_banner.jpg"
            alt="Sacred Hindu Temple in India"
            className="w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-xl"
            loading="eager"
          />
        </div>
      </section>
    </main>
  );
}
