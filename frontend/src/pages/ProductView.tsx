// E:\devalayaum\frontend\src\pages\ProductView.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// 🔹 Helper to load Razorpay SDK dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Product>(`${backendURL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

  const title = product.name?.[lang] || product.name?.en || "Untitled";
  const desc = product.description?.[lang] || product.description?.en || "";
  const benefit = product.spiritualBenefit?.[lang] || "";
  const deity = product.deityAssociated?.[lang] || "";
  const mantra = product.mantra?.[lang] || "";

  // 🔹 Payment handler
  const handleBuy = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const userId = localStorage.getItem("USER_ID");

    if (!token || !userId) {
      alert("Please login first to buy this product.");
      navigate("/login");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    try {
      const amount = product.discountPrice || product.price;

      const res = await axios.post(`${backendURL}/api/product-payments/create-order`, {
        productId: product._id,
        amount,
        userId,
      });

      const { orderId, amount: orderAmount, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "Devalayaum",
        description: `Purchase: ${title}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await axios.post(`${backendURL}/api/product-payments/verify`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert("🎉 Payment Successful! Thank you for your purchase.");
            navigate("/order-success");
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment succeeded but verification failed. Please contact support.");
          }
        },
        prefill: {
          email: localStorage.getItem("auth_email") || "",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Payment failed to start. Please try again.");
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 md:px-16 bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <Link to="/products" className="text-orange-700 hover:underline mb-4 block">
        ← Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        {/* 🖼️ Image Section */}
        <div className="md:w-1/2">
          <img
            src={product.thumbnail || product.images?.[0] || "/placeholder.jpg"}
            alt={title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg border border-orange-200"
          />
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${title}-${i}`}
                  className="w-24 h-24 object-cover rounded-lg border border-orange-100 hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}
          {product.videoUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Product Video</h3>
              <iframe
                src={product.videoUrl.replace("watch?v=", "embed/")}
                title={title}
                className="w-full h-64 rounded-lg shadow"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* 🧾 Content Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-orange-800 mb-2">{title}</h1>
          <p className="text-gray-700 mb-2">Category: {product.category}</p>
          {product.subCategory && (
            <p className="text-gray-700 mb-2">Subcategory: {product.subCategory}</p>
          )}
          <div className="mt-3 text-2xl font-bold text-green-700">
            ₹{product.discountPrice || product.price}
            {product.discountPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">₹{product.price}</span>
            )}
          </div>

          <hr className="my-4 border-orange-200" />

          <p className="text-gray-700 mb-4 leading-relaxed">{desc}</p>

          {benefit && (
            <div className="mb-4">
              <h3 className="font-semibold text-orange-700 mb-1">Spiritual Benefit</h3>
              <p className="text-gray-700">{benefit}</p>
            </div>
          )}

          {deity && (
            <div className="mb-4">
              <h3 className="font-semibold text-orange-700 mb-1">Associated Deity</h3>
              <p className="text-gray-700">{deity}</p>
            </div>
          )}

          {mantra && (
            <div className="mb-4">
              <h3 className="font-semibold text-orange-700 mb-1">Mantra</h3>
              <p className="italic text-gray-800">"{mantra}"</p>
            </div>
          )}

          {product.material && <p className="text-gray-600 mb-1">Material: {product.material}</p>}
          {product.dimensions && <p className="text-gray-600 mb-1">Dimensions: {product.dimensions}</p>}
          {product.size && <p className="text-gray-600 mb-3">Size: {product.size}</p>}

          <button
            onClick={handleBuy}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            🛒 Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
