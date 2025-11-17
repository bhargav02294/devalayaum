// src/pages/ProductView.tsx
// PREMIUM SPIRITUAL PRODUCT PAGE — AMAZON STYLE + DEVOTIONAL THEME
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// --- Razorpay option / response types (kept strongly typed) ----
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
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
}

// --- Razorpay Loader -------------------------------------------------
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// --- Product type ---------------------------------------------------
interface Product {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  material: string;
  spiritualBenefit: Record<string, string>;
  deityAssociated: Record<string, string>;
  mantra: Record<string, string>;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  videoUrl?: string;
  dimensions?: string;
  size?: string;
}

// --- Component ------------------------------------------------------
export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const backendURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const lang = i18n.language || "en";
  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  // Load product from API
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get<Product>(`${backendURL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Product load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, backendURL]);

  if (loading) return <p className="pt-24 text-center">Loading...</p>;
  if (!product) return <p className="pt-24 text-center text-gray-600">Product not found.</p>;

  // Gallery
  const gallery = [...(product.images || [])];
  if (product.thumbnail && !gallery.includes(product.thumbnail)) {
    gallery.unshift(product.thumbnail);
  }
  if (gallery.length === 0) gallery.push("/placeholder.jpg");
  const mainImage = hoverPreview || gallery[activeImageIndex];

  // Buy handler with safe typed constructor retrieval
  const handleBuy = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const userId = localStorage.getItem("USER_ID");

    if (!token || !userId) {
      alert("Please login first to buy this product.");
      navigate("/login");
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok) {
      alert("Unable to load Razorpay script. Check your network.");
      return;
    }

    try {
      const amount = product.discountPrice || product.price;
      // Create order on backend
      const orderRes = await axios.post(`${backendURL}/api/product-payments/create-order`, {
        productId: product._id,
        amount,
        userId,
      });

      const { orderId, amount: orderAmount, currency } = orderRes.data;

      // Build strongly typed options
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "Devalayaum Store",
        description: t(product.name),
        order_id: orderId,
        handler: async function (resp: RazorpayResponse) {
          try {
            await axios.post(`${backendURL}/api/product-payments/verify`, {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            });
            alert("🙏 Payment Successful!");
            navigate("/order-success");
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment succeeded but verification failed. Please contact support.");
          }
        },
        prefill: { email: localStorage.getItem("auth_email") || "" },
        theme: { color: "#c46a1e" },
      };

      // SAFELY get constructor from window without using `any`
      const maybeRazorpayCtor = (window as unknown as {
        Razorpay?: { new (opts: RazorpayOptions): RazorpayInstance };
      }).Razorpay;

      if (!maybeRazorpayCtor) {
        alert("Razorpay SDK not available. Please try again later.");
        return;
      }

      const rzp = new maybeRazorpayCtor(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Payment failed to start. Please try again.");
    }
  };

  const glow = "shadow-[0_10px_30px_rgba(180,110,40,0.18)]";

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff7e3] via-[#fffdf8] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/products" className="text-orange-700 hover:underline mb-4 block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: gallery */}
          <div>
            <div className={`rounded-3xl overflow-hidden bg-white ${glow}`}>
              <div className="h-[520px] flex justify-center items-center bg-gradient-to-b from-white to-[#fff3e2]">
                <img src={mainImage} alt={t(product.name)} className="max-w-full max-h-full object-contain" />
              </div>

              <div className="p-4 flex gap-4 overflow-x-auto bg-[#fffaf5] justify-center">
                {gallery.map((src, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoverPreview(src)}
                    onMouseLeave={() => setHoverPreview(null)}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`rounded-xl overflow-hidden transition-all ${
                      idx === activeImageIndex ? "ring-2 ring-orange-400 scale-105" : "hover:scale-105"
                    }`}
                    style={{ width: 110, height: 80 }}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {product.videoUrl && (
              <div className="mt-4">
                <button onClick={() => setVideoOpen(true)} className="bg-white border px-4 py-2 rounded-lg shadow hover:bg-orange-50">
                  ▶ Watch Product Video
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: info */}
          <div>
            <h1 className="text-4xl font-[Marcellus] text-orange-900 font-bold mb-2">{t(product.name)}</h1>

            <p className="text-gray-700 mb-1">Category: {product.category}</p>
            {product.subCategory && <p className="text-gray-700 mb-1">Subcategory: {product.subCategory}</p>}

            <div className="mt-4 p-4 bg-[#fff6e9] border border-orange-200 rounded-xl">
              <span className="text-3xl font-bold text-orange-800">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && <span className="ml-3 text-gray-500 line-through text-lg">₹{product.price}</span>}

              <div className="mt-3">
                <button onClick={handleBuy} className="bg-orange-700 text-white px-6 py-3 rounded-xl hover:bg-orange-800 shadow-md">
                  🛒 Buy Now
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{t(product.description)}</p>
            </div>

            {product.spiritualBenefit && (
              <div className="mt-6">
                <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-2">Spiritual Benefits</h2>
                <p className="text-gray-700">{t(product.spiritualBenefit)}</p>
              </div>
            )}

            {product.deityAssociated && (
              <div className="mt-6">
                <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-2">Associated Deity</h2>
                <p className="text-gray-700">{t(product.deityAssociated)}</p>
              </div>
            )}

            {product.mantra && (
              <div className="mt-6">
                <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-2">Mantra</h2>
                <p className="italic text-gray-800">"{t(product.mantra)}"</p>
              </div>
            )}

            <div className="mt-6 space-y-1 text-gray-700">
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.size && <p><strong>Size:</strong> {product.size}</p>}
              {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      {videoOpen && product.videoUrl && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={() => setVideoOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3">
              <button onClick={() => setVideoOpen(false)}>✕</button>
            </div>

            <div className="aspect-video">
              {(product.videoUrl.includes("youtube") || product.videoUrl.includes("youtu.be")) ? (
                <iframe className="w-full h-full" src={product.videoUrl.replace("watch?v=", "embed/")} allowFullScreen />
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
