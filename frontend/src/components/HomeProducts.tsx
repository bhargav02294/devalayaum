// src/components/HomeProducts.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Product {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: string;
  subCategory?: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  published: boolean;
}

export default function HomeProducts() {
  const backendURL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/products/home-list`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Products fetch error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">
        Loading authentic Hindu spiritual products…
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No spiritual puja products available right now.
      </p>
    );
  }

  const text = {
    heading: {
      en: "Sacred Spiritual Products for Daily Hindu Worship",
      hi: "दैनिक हिंदू पूजा के लिए पवित्र आध्यात्मिक उत्पाद",
      mr: "दैनंदिन हिंदू पूजेसाठी पवित्र आध्यात्मिक उत्पादने",
      ta: "தினசரி இந்து வழிபாட்டிற்கான புனித ஆன்மீக பொருட்கள்",
      te: "దైనందిన హిందూ పూజల కోసం పవిత్ర ఆధ్యాత్మిక ఉత్పత్తులు",
      bn: "দৈনন্দিন হিন্দু পূজার জন্য পবিত্র আধ্যাত্মিক পণ্য",
    },
    subHeading: {
      en: "Buy authentic Hindu puja samagri, divine idols, malas, incense sticks and sacred spiritual essentials online.",
      hi: "प्रामाणिक हिंदू पूजा सामग्री, दिव्य मूर्तियाँ, माला और पवित्र वस्तुएँ ऑनलाइन खरीदें।",
      mr: "प्रामाणिक हिंदू पूजा साहित्य, दिव्य मूर्ती, माळा आणि पवित्र वस्तू ऑनलाइन खरेदी करा.",
      ta: "உண்மையான இந்து பூஜை பொருட்கள், தெய்வீக சிலைகள் மற்றும் புனித உபகரணங்களை வாங்குங்கள்.",
      te: "ప్రామాణిక హిందూ పూజ సామగ్రి, దైవ విగ్రహాలు మరియు పవిత్ర వస్తువులు కొనండి.",
      bn: "প্রামাণিক হিন্দু পূজা সামগ্রী, দিভ্য মূর্তি ও পবিত্র উপকরণ অনলাইনে কিনুন।",
    },
    tag: {
      en: "Spiritual Product",
      hi: "आध्यात्मिक उत्पाद",
      mr: "आध्यात्मिक उत्पाद",
      ta: "ஆன்மீக பொருள்",
      te: "ఆధ్యాత్మిక ఉత్పత్తి",
      bn: "আধ্যাত্মিক পণ্য",
    },
    buyNow: {
      en: "Buy Now",
      hi: "अभी खरीदें",
      mr: "आत्ताच खरेदी करा",
      ta: "இப்போது வாங்க",
      te: "ఇప్పుడే కొనండి",
      bn: "এখনই কিনুন",
    },
    viewAll: {
      en: "View All Hindu Spiritual Products",
      hi: "सभी आध्यात्मिक उत्पाद देखें",
      mr: "सर्व आध्यात्मिक उत्पादने पहा",
      ta: "அனைத்து ஆன்மீக பொருட்களையும் பார்க்கவும்",
      te: "అన్ని ఆధ్యాత్మిక ఉత్పత్తులను చూడండి",
      bn: "সব আধ্যাত্মিক পণ্য দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-orange-50"
      aria-label="Online store for Hindu spiritual products and puja items"
    >
      <header className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto">
          {t(text.subHeading)}
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {products.slice(0, 3).map((p) => {
          const name = p.name?.[lang] || p.name?.en || "Untitled";
          const desc =
            p.description?.[lang]?.slice(0, 95) ||
            p.description?.en?.slice(0, 95) ||
            "";

          const price = p.discountPrice || p.price;
          const originalPrice = p.discountPrice ? p.price : null;

          return (
            <article key={p._id}>
              <div
                className="group rounded-2xl overflow-hidden bg-white shadow-lg border border-orange-100
                           hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)]
                           transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={p.thumbnail || p.images?.[0] || "/placeholder.jpg"}
                    alt={`${name} Hindu spiritual puja product available online`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                    loading="lazy"
                  />

                  <div className="absolute top-3 left-3 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {t(text.tag)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8f4500] mb-2">
                    {name}
                  </h3>

                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {desc}…
                  </p>

                  <div className="mb-6">
                    <span className="text-2xl font-bold text-green-700">
                      ₹{price}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-3">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/products/${p._id}`}
                    title={`Buy ${name} online – Hindu spiritual product`}
                    aria-label={`Buy ${name} spiritual product`}
                    className="block text-center w-full bg-[#b35b00] hover:bg-[#8f4500]
                               text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                  >
                    {t(text.buyNow)}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <Link
          to="/products"
          title="Browse all Hindu spiritual products and puja items"
          aria-label="View all spiritual products"
          className="inline-block px-8 py-3 border border-[#b35b00] rounded-full
                     text-[#b35b00] font-semibold text-sm
                     transition-all duration-500
                     hover:bg-[#b35b00] hover:text-white shadow-sm"
        >
          {t(text.viewAll)}
        </Link>
      </div>
    </section>
  );
}
