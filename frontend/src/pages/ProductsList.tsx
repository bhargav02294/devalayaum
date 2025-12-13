// ProductsList.tsx — FULL MULTILANGUAGE + ORIGINAL DESIGN (CLEANED)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Product Interface
interface Product {
  _id: string;
  name: Record<string, string>;
  category: string;
  description?: Record<string, string>;
  price: number;
  discountPrice: number;
  thumbnail: string;
  images: string[];
  published: boolean;
}

function ScrollingBorder({ flipped = false }: { flipped?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className="animate-border-left"
        style={{
          backgroundImage: flipped
            ? "url('/temple-border-flip.png?rev=4')"
            : "url('/temple-border.png?rev=4')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "260px auto",
          height: "45px",
          width: "300%",
        }}
      />
    </div>
  );
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;

  // LIVE LANGUAGE SUPPORT
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  // Load products
  useEffect(() => {
    axios
      .get(`${backendURL}/api/products`)
      .then((res) =>
        setProducts(res.data.filter((p: Product) => p.published !== false))
      )
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        {t({
          en: "Loading products...",
          hi: "उत्पाद लोड हो रहे हैं...",
          mr: "उत्पाद लोड होत आहेत...",
        })}
      </p>
    );

  if (products.length === 0)
    return (
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-3">
          {t({
            en: "No Products Found",
            hi: "कोई उत्पाद नहीं मिला",
            mr: "उत्पाद सापडले नाहीत",
          })}
        </h2>
        <p className="text-sm md:text-base">
          {t({
            en: "New products will be added soon.",
            hi: "नए उत्पाद जल्द ही जोड़े जाएंगे।",
            mr: "नवीन उत्पाद लवकरच जोडले जातील.",
          })}
        </p>
      </div>
    );

  return (
    <div
      className="pt-20 md:pt-24 pb-16"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* Top Border */}
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">
        <div>
          <h1
            className="text-3xl md:text-5xl font-bold font-[Marcellus] leading-tight drop-shadow-md"
            style={{ color: "#b34a00" }}
          >
            {t({
              en: "Pure Spiritual Items for Your Daily Worship",
              hi: "आपकी दैनिक पूजा के लिए पवित्र आध्यात्मिक वस्तुएँ",
              mr: "आपल्या दैनंदिन पूजेसाठी पवित्र आध्यात्मिक वस्तू",
            })}
          </h1>

          <ul className="mt-4 space-y-2 md:space-y-3 text-gray-700 text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>
              {t({
                en: "Every product is chosen with purity and devotion.",
                hi: "हर उत्पाद शुद्धता और भक्ति के साथ चुना गया है।",
                mr: "प्रत्येक उत्पाद पवित्रता आणि भक्तीने निवडला आहे.",
              })}
            </li>
            <li>
              {t({
                en: "Bring home the blessings of divine energy.",
                hi: "दिव्य ऊर्जा के आशीर्वाद घर लाएँ।",
                mr: "दिव्य ऊर्जेचे आशीर्वाद घरी आणा.",
              })}
            </li>
            <li>
              {t({
                en: "From diyas to idols — everything your worship needs.",
                hi: "दिया से मूर्ति तक — पूजा की हर ज़रूरत यहाँ है।",
                mr: "दिया ते मूर्ती — पूजाेसाठी आवश्यक सर्व काही.",
              })}
            </li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/product.png"
            alt="Devotional Products Artwork"
            className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>
      </div>

      {/* Bottom Border */}
      <ScrollingBorder flipped />

      {/* PRODUCT CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6">
        {products.map((p) => {
          const title = t(p.name);
          const desc = t(p.description);
          const thumb = p.thumbnail || p.images?.[0] || "/placeholder.jpg";

          return (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="block rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                <img
                  src={thumb}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">
                  {title}
                </h2>

                <p className="text-gray-600 text-sm">{p.category}</p>

                <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                  {desc.slice(0, 130)}...
                </p>

                <p className="text-orange-700 font-semibold text-lg">
                  ₹{p.discountPrice || p.price}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
