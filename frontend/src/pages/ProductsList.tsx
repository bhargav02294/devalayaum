// E:\devalayaum\frontend\src\pages\ProductsList.tsx
// Fully corrected — matches backend Product model + correct UI layout

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Icon (inline)
function MapPin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
    </svg>
  );
}

// Correct Interface for Products
interface Product {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  description?: Record<string, string>;
  material?: string;
  spiritualBenefit?: Record<string, string>;
  usageInstruction?: Record<string, string>;
  deityAssociated?: Record<string, string>;
  mantra?: Record<string, string>;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  dimensions?: string;
  size?: string;
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
          backgroundSize: "330px auto",
          height: "60px",
          width: "300%",
          opacity: 1,
        }}
      />
    </div>
  );
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

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
        Loading products...
      </p>
    );

  if (products.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold text-orange-700 mb-3">
          No Products Found
        </h2>
        <p>New spiritual products will be added soon 🙏</p>
      </div>
    );

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      <ScrollingBorder />

      {/* HEADER SECTION with 60/40 layout */}
      <div className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">

        {/* LEFT BLOCK */}
        <div>
          <h1
            className="text-5xl font-bold font-[Marcellus] drop-shadow-md leading-tight"
            style={{ color: "#b34a00", marginTop: 0, paddingTop: 0 }}
          >
            Pure Spiritual Items for Your Daily Worship
          </h1>

          <ul
            className="space-y-3 text-xl font-[Poppins] leading-relaxed list-disc pl-5"
            style={{ color: "#5a4636", marginTop: "15px" }}
          >
            <li>Every product is chosen with purity and devotion.</li>
            <li>Bring home the blessings of divine energy.</li>
            <li>From diyas to idols — everything your worship needs.</li>
            <li>High-quality spiritual items delivered with trust.</li>
            <li>Make every prayer more powerful with pure products.</li>
            <li>Spirituality made simple, sacred, and accessible.</li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/product.png"
            alt="Devotional Products Artwork"
            className="w-[360px] md:w-[460px] lg:w-[540px] drop-shadow-xl"
          />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* PRODUCT CARDS */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
        {products.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled Product";
          const desc = p.description?.[lang] || p.description?.en || "";
          const thumb = p.thumbnail || p.images?.[0] || "/placeholder.jpg";

          return (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="block rounded-2xl overflow-hidden"
            >
              <div className="border rounded-2xl bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">

                {/* PRODUCT IMAGE */}
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={thumb}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">
                    {title}
                  </h2>

                  <div className="flex items-center text-gray-600 text-sm gap-1">
                    <MapPin size={18} />
                    <span>{p.category}</span>
                  </div>

                  <p className="text-sm text-gray-700 font-[Poppins] leading-relaxed">
                    {desc.slice(0, 140)}...
                  </p>

                  {/* PRICE */}
                  <p className="text-orange-700 font-semibold text-lg">
                    ₹{p.discountPrice || p.price}
                  </p>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
