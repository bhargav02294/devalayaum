// ProductView.tsx — FULL MULTILANGUAGE + PREMIUM UI + RAZORPAY PAYMENT (ESLint-clean)
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ---------------- PRODUCT INTERFACE ---------------- */
interface Product {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  spiritualBenefit: Record<string, string>;
  deityAssociated: Record<string, string>;
  mantra: Record<string, string>;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  material: string;
  size?: string;
  dimensions?: string;
  images?: string[];
  thumbnail?: string;
  videoUrl?: string;
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const backendURL = import.meta.env.VITE_API_URL;

  /* Live Language Support */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);
  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  /* Fetch Product */
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get<Product>(`${backendURL}/api/products/${id}`);
        setProduct(res.data);
      } catch {
        console.error("Product load failed");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, backendURL]);

  if (loading) return <p className="pt-24 text-center">Loading…</p>;
  if (!product)
    return (
      <p className="pt-24 text-center text-gray-600">
        {t({
          en: "Product not found",
          hi: "उत्पाद नहीं मिला",
          mr: "उत्पाद आढळला नाही",
        })}
      </p>
    );

  /* Build Gallery */
  const gallery = [...(product.images || [])];
  if (product.thumbnail && !gallery.includes(product.thumbnail))
    gallery.unshift(product.thumbnail);
  if (gallery.length === 0) gallery.push("/placeholder.jpg");

  const mainImg = hoverPreview || gallery[activeIndex];

  /* ---------------- HANDLE BUY NOW ---------------- */
  const handleBuy = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  if (!token || !userId) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  try {
    const res = await axios.post(
      `${backendURL}/api/product-payments/create-order`,
      { productId: product._id, userId }
    );

    if (res.data.redirectUrl) {
      window.location.href = res.data.redirectUrl;
    } else {
      alert("Payment initiation failed");
    }
  } catch {
    alert("Unable to start payment");
  }
};


  const glow = "shadow-[0_6px_20px_rgba(200,130,50,0.20)]";

  /* ----------------------------------------------------
     UI
  ---------------------------------------------------- */
  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff7e3] via-[#fffdf8] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <Link to="/products" className="text-orange-700 hover:underline mb-4 block">
          ← {t({ en: "Back to Products", hi: "उत्पादों पर वापस जाएँ", mr: "उत्पादांकडे परत जा" })}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT: IMAGES */}
          <div>
            <div className={`rounded-3xl overflow-hidden bg-white ${glow}`}>
              <div className="h-[420px] flex justify-center items-center bg-gradient-to-b from-white to-[#fff3e2]">
                <img src={mainImg} className="max-w-full max-h-full object-contain" />
              </div>

              <div className="p-4 flex gap-4 overflow-x-auto bg-[#fffaf4] justify-center">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverPreview(src)}
                    onMouseLeave={() => setHoverPreview(null)}
                    onClick={() => setActiveIndex(i)}
                    className={`rounded-xl overflow-hidden transition-all ${
                      i === activeIndex ? "ring-2 ring-orange-400 scale-105" : "hover:scale-105"
                    }`}
                    style={{ width: 105, height: 72 }}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {product.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="mt-4 bg-white border px-4 py-2 rounded-lg hover:bg-orange-50 shadow"
              >
                ▶ {t({ en: "Watch Product Video", hi: "उत्पाद वीडियो देखें", mr: "उत्पादन व्हिडिओ पाहा" })}
              </button>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div>
            <h1 className="mt-4 text-3xl lg:text-4xl font-[Marcellus] text-orange-700 font-bold">
              {t(product.name)}
            </h1>

            <p className="text-gray-600 mt-2 font-[Merriweather]">
              {t({ en: "Category", hi: "श्रेणी", mr: "श्रेणी" })}: {product.category}
            </p>
            {product.subCategory && (
              <p className="text-gray-600 font-[Merriweather]">
                {t({ en: "Subcategory", hi: "उपश्रेणी", mr: "उपश्रेणी" })}: {product.subCategory}
              </p>
            )}

            {/* PRICE BOX */}
            <div className="mt-6 p-5 bg-[#fff6e9] border border-orange-200 rounded-2xl relative">
              {product.discountPrice && (
                <p className="text-sm text-gray-500 line-through font-[Merriweather] mb-1">
                  ₹{product.price}
                </p>
              )}

              <p className="text-3xl font-[Merriweather] font-bold text-orange-900">
                ₹{product.discountPrice || product.price}
              </p>

              <div className="mt-4">
                <button
                  onClick={handleBuy}
                  className="px-6 py-2 rounded-xl text-white text-[15px] font-[Merriweather]
                    bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                    shadow-[0_4px_18px_rgba(255,150,70,0.45)] transition-all w-[40%] min-w-[140px]"
                >
                  {t({ en: "Buy Now", hi: "अभी खरीदें", mr: "आता खरेदी करा" })}
                </button>
              </div>
            </div>

            {/* DETAILS SECTIONS */}
            <DetailSection title={t({ en: "Description", hi: "विवरण", mr: "वर्णन" })}>
              {t(product.description)}
            </DetailSection>

            {product.spiritualBenefit && (
              <DetailSection title={t({ en: "Spiritual Benefits", hi: "आध्यात्मिक लाभ", mr: "आध्यात्मिक लाभ" })}>
                {t(product.spiritualBenefit)}
              </DetailSection>
            )}

            {product.deityAssociated && (
              <DetailSection title={t({ en: "Associated Deity", hi: "संबंधित देवता", mr: "संबंधित देवता" })}>
                {t(product.deityAssociated)}
              </DetailSection>
            )}

            {product.mantra && (
              <DetailSection title={t({ en: "Mantra", hi: "मंत्र", mr: "मंत्र" })}>
                <span className="italic text-lg">"{t(product.mantra)}"</span>
              </DetailSection>
            )}

            <div className="mt-8 text-gray-700 font-[Merriweather] space-y-1">
              {product.material && (
                <p>
                  <strong>{t({ en: "Material", hi: "सामग्री", mr: "साहित्य" })}:</strong>{" "}
                  {product.material}
                </p>
              )}
              {product.size && (
                <p>
                  <strong>{t({ en: "Size", hi: "आकार", mr: "आकार" })}:</strong> {product.size}
                </p>
              )}
              {product.dimensions && (
                <p>
                  <strong>{t({ en: "Dimensions", hi: "आयाम", mr: "परिमाण" })}:</strong>{" "}
                  {product.dimensions}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO POPUP */}
      {videoOpen && product.videoUrl && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-3">
              <button onClick={() => setVideoOpen(false)}>✕</button>
            </div>

            <div className="aspect-video">
              {(product.videoUrl.includes("youtube") ||
                product.videoUrl.includes("youtu.be")) ? (
                <iframe
                  className="w-full h-full"
                  src={product.videoUrl.replace("watch?v=", "embed/")}
                  allowFullScreen
                />
              ) : (
                <video src={product.videoUrl} controls className="w-full h-full bg-black" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SECTION COMPONENT ---------------- */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-[18px] font-[Merriweather] font-semibold text-orange-600 mb-2">
        {title}
      </h2>
      <p className="text-gray-700 leading-relaxed font-[Merriweather]">
        {children}
      </p>
    </section>
  );
}
