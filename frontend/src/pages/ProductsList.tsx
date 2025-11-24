// Fully optimized ProductsList with Mobile + Desktop responsive layout
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Inline MapPin Icon
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

// Correct Product Interface
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
          backgroundSize: "260px auto", // MOBILE optimized
          height: "45px", // MOBILE optimized
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
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-3">
          No Products Found
        </h2>
        <p className="text-sm md:text-base">
          New spiritual products will be added soon 🙏
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

        {/* LEFT TEXT BLOCK */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-[Marcellus] leading-tight drop-shadow-md"
            style={{ color: "#b34a00" }}
          >
            Pure Spiritual Items for Your Daily Worship
          </h1>

          <ul className="mt-4 space-y-2 md:space-y-3 text-gray-700 text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
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
            className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>
      </div>

      {/* Bottom Border */}
      <ScrollingBorder flipped />

      {/* PRODUCT CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6">

        {products.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled Product";
          const desc = p.description?.[lang] || p.description?.[lang] || "";
          const thumb = p.thumbnail || p.images?.[0] || "/placeholder.jpg";

          return (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="block rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {/* IMAGE */}
              <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                <img
                  src={thumb}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">
                  {title}
                </h2>

                {/* Category */}
                <div className="flex items-center text-gray-600 text-sm gap-1">
                  <MapPin size={17} />
                  <span className="truncate max-w-[100px] md:max-w-[150px]">
                    {p.category}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                  {desc.slice(0, 130)}...
                </p>

                {/* PRICE */}
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
