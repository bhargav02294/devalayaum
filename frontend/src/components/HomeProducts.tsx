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

  // 🔥 Re-render instantly when language changes
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

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading products…</p>;

  if (products.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No spiritual products available.
      </p>
    );

  // 🌍 Language text
  const text = {
    heading: {
      en: "Sacred Spiritual Products",
      hi: "पवित्र आध्यात्मिक उत्पाद",
      mr: "पवित्र आध्यात्मिक उत्पादने",
      ta: "புனித ஆன்மீக பொருட்கள்",
      te: "పవిత్ర ఆధ్యాత్మిక ఉత్పత్తులు",
      bn: "পবিত্র আধ্যাত্মিক পণ্য",
    },
    subHeading: {
      en: "Handpicked divine items filled with blessings and purity",
      hi: "आशीर्वाद और पवित्रता से भरपूर चयनित दिव्य वस्तुएँ",
      mr: "आशीर्वाद आणि पवित्रतेने भरलेल्या निवडक दिव्य वस्तू",
      ta: "ஆசியும் தூய்மையும் நிறைந்த தேர்ந்தெடுக்கப்பட்ட தெய்வீக பொருட்கள்",
      te: "ఆశీర్వాదం మరియు పవిత్రతతో నిండిన ఎంపిక చేసిన దైవిక వస్తువులు",
      bn: "আশীর্বাদ ও পবিত্রতায় ভরপুর নির্বাচিত দিভ্য সামগ্রী",
    },
    tag: {
      en: "Spiritual",
      hi: "आध्यात्मिक",
      mr: "आध्यात्मिक",
      ta: "ஆன்மீக",
      te: "ఆధ్యాత్మిక",
      bn: "আধ্যাত্মিক",
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
      en: "View All Products",
      hi: "सभी उत्पाद देखें",
      mr: "सर्व उत्पादने पहा",
      ta: "அனைத்து பொருட்களையும் பார்க்க",
      te: "అన్ని ఉత్పత్తులను చూడండి",
      bn: "সব পণ্য দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj["en"];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg">{t(text.subHeading)}</p>
      </div>

      {/* Product Cards */}
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
            <div
              key={p._id}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg border border-orange-100 hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] transition-all duration-500 hover:-translate-y-2"
            >
              {/* Thumbnail */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={p.thumbnail || p.images?.[0] || "/placeholder.jpg"}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />

                {/* Tag */}
                <div className="absolute top-3 left-3 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {t(text.tag)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#8f4500] mb-2">
                  {name}
                </h3>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {desc}...
                </p>

                {/* Price */}
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

                {/* Button */}
                <Link
                  to={`/products/${p._id}`}
                  className="block text-center w-full bg-[#b35b00] hover:bg-[#8f4500] text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                >
                  {t(text.buyNow)}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      <div className="text-center mt-16">
        <Link
          to="/products"
          className="relative inline-block group px-5 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-semibold text-sm overflow-hidden transition-all duration-500"
        >
          <span className="absolute left-0 top-0 w-0 h-full bg-[#b35b00] transition-all duration-700 group-hover:w-full"></span>

          <span className="relative z-10 group-hover:text-white transition-all duration-500">
            {t(text.viewAll)}
          </span>
        </Link>
      </div>
    </section>
  );
}
