// src/pages/ProductView.tsx
// PREMIUM SPIRITUAL PRODUCT PAGE — CLEAN LUXURY LAYOUT + TEMPLE THEME

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ------------------ Razorpay Types ------------------ */
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; contact?: string; email?: string };
  theme?: { color?: string };
}
interface RazorpayInstance {
  open: () => void;
}

/* ---------------- Razorpay Loader ------------------- */
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    const exists = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (exists) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ---------------- Product Interface ----------------- */
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
  const lang = i18n.language || "en";
  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  /* Load Product */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Product>(`${backendURL}/api/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        console.error("Product load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading) return <p className="pt-24 text-center">Loading…</p>;
  if (!product) return <p className="pt-24 text-center text-gray-600">Product not found</p>;

  /* Build Gallery */
  const gallery = [...(product.images || [])];
  if (product.thumbnail && !gallery.includes(product.thumbnail))
    gallery.unshift(product.thumbnail);
  if (gallery.length === 0) gallery.push("/placeholder.jpg");

  const mainImg = hoverPreview || gallery[activeIndex];

  /* Handle Buy Now */
  const handleBuy = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const userId = localStorage.getItem("USER_ID");

    if (!token || !userId) {
      alert("Please login first to buy this product.");
      navigate("/login");
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check internet.");
      return;
    }

    try {
      const amount = product.discountPrice || product.price;

      const res = await axios.post(`${backendURL}/api/product-payments/create-order`, {
        productId: product._id,
        userId,
        amount,
      });

      const { orderId, amount: finalAmount, currency } = res.data;

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalAmount,
        currency,
        name: "Devalayaum Store",
        description: t(product.name),
        order_id: orderId,

        handler: async (resp: RazorpayResponse) => {
          try {
            await axios.post(`${backendURL}/api/product-payments/verify`, {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            });
            alert("🙏 Payment Successful!");
            navigate("/order-success");
          } catch (e) {
            console.error("Verification failed:", e);
            alert("Payment succeeded but verification failed.");
          }
        },

        prefill: { email: localStorage.getItem("auth_email") || "" },

        theme: { color: "#c46a1e" },
      };

      const ctor = (window as unknown as { Razorpay?: new (o: RazorpayOptions) => RazorpayInstance })
        .Razorpay;

      if (!ctor) {
        alert("Razorpay SDK not ready.");
        return;
      }

      new ctor(options).open();
    } catch (e) {
      console.error("Payment failed:", e);
      alert("Payment could not be initiated.");
    }
  };

  const glow = "shadow-[0_6px_20px_rgba(200,130,50,0.20)]";

  /* ----------------------------------------------------
     UI START
  ---------------------------------------------------- */
  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff7e3] via-[#fffdf8] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <Link to="/products" className="text-orange-700 hover:underline mb-4 block">
        
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ---------------- LEFT: FIXED IMAGE SECTION ---------------- */}
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
                ▶ Watch Product Video
              </button>
            )}
          </div>

          {/* ---------------- RIGHT: PRODUCT DETAILS ---------------- */}
          <div>
            {/* TITLE */}
            <h1 className="mt-4 text-3xl lg:text-4xl font-[Marcellus] text-orange-700 font-bold">
              {t(product.name)}
            </h1>

            <p className="text-gray-600 mt-2 font-[Merriweather]">
              Category: {product.category}
            </p>
            {product.subCategory && (
              <p className="text-gray-600 font-[Merriweather]">
                Subcategory: {product.subCategory}
              </p>
            )}

           {/* PRICE BOX — LUXURY STYLE (FIXED) */}
<div className="mt-6 p-5 bg-[#fff6e9] border border-orange-200 rounded-2xl relative">

  {/* Strike Price — Clean Above Main Price */}
  {product.discountPrice && (
    <p className="text-sm text-gray-500 line-through font-[Merriweather] mb-1">
      ₹{product.price}
    </p>
  )}

  {/* Main Price — Slightly Smaller */}
  <p className="text-3xl font-[Merriweather] font-bold text-orange-900">
    ₹{product.discountPrice || product.price}
  </p>

  {/* Premium Golden Button */}
  <div className="mt-4 flex justify-start">
  <button
    onClick={handleBuy}
    className="
      px-6 py-2
      rounded-xl
      text-white text-[15px] font-[Merriweather]
      bg-gradient-to-r from-orange-500 to-orange-600
      hover:from-orange-600 hover:to-orange-700
      shadow-[0_4px_18px_rgba(255,150,70,0.45)]
      transition-all
      w-[40%]   /* NEW: Small premium width */
      min-w-[140px] /* ensures it never becomes too small */
    "
  >
    Buy Now
  </button>
</div>

</div>


            {/* SECTION: DESCRIPTION */}
            <div className="mt-10">
              <h2 className="text-[18px] font-[Merriweather] font-semibold text-orange-600 mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed font-[Merriweather]">
                {t(product.description)}
              </p>
            </div>

            {/* SECTION: SPIRITUAL BENEFITS */}
            {product.spiritualBenefit && (
              <div className="mt-8">
                <h2 className="text-[18px] font-[Merriweather] font-semibold text-orange-600 mb-2">
                  Spiritual Benefits
                </h2>
                <p className="text-gray-700 font-[Merriweather]">
                  {t(product.spiritualBenefit)}
                </p>
              </div>
            )}

            {/* SECTION: DEITY ASSOCIATED */}
            {product.deityAssociated && (
              <div className="mt-8">
                <h2 className="text-[18px] font-[Merriweather] font-semibold text-orange-600 mb-2">
                  Associated Deity
                </h2>
                <p className="text-gray-700 font-[Merriweather]">
                  {t(product.deityAssociated)}
                </p>
              </div>
            )}

            {/* SECTION: MANTRA */}
            {product.mantra && (
              <div className="mt-8">
                <h2 className="text-[18px] font-[Merriweather] font-semibold text-orange-600 mb-2">
                  Mantra
                </h2>
                <p className="italic text-gray-900 font-[Merriweather]">
                  "{t(product.mantra)}"
                </p>
              </div>
            )}

            {/* MATERIAL / SIZE */}
            <div className="mt-8 text-gray-700 font-[Merriweather] space-y-1">
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.size && <p><strong>Size:</strong> {product.size}</p>}
              {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
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
              {(product.videoUrl.includes("youtube") || product.videoUrl.includes("youtu.be")) ? (
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
