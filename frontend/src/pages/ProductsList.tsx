import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Product {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  published?: boolean;
}

// 🔱 Scrolling Border Component (with vertical flip support)
function ScrollingBorder({ flipVertical = false }: { flipVertical?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className={`animate-border-left ${
          flipVertical ? "border-flip-vertical" : ""
        }`}
        style={{
          backgroundImage: "url('/temple-border.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "110px auto",
          height: "22px",
          width: "300%",
          opacity: 0.95,
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
    const loadProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          `${backendURL}/api/products?published=true`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 font-semibold text-lg">
        Loading products...
      </p>
    );

  if (products.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold text-orange-700">
          No Products Available
        </h2>
        <p className="mt-3">New spiritual items will be added soon 🙏</p>
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
      {/* 🔱 Top Border */}
      <ScrollingBorder />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-6">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md">
          🙏 Devotional & Spiritual Products
        </h1>

        <p className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins]">
          Explore our sacred collection of spiritual products crafted for
          devotees — from holy idols and pooja essentials to blessed items that
          bring positivity and divine energy into your home.
        </p>
      </div>

      {/* 🔱 Middle Border (Flipped) */}
      <ScrollingBorder flipVertical />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        {products.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled Product";

          return (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="group rounded-2xl overflow-hidden bg-white border border-yellow-300 
              shadow-lg hover:shadow-[0_0_25px_rgba(255,170,0,0.5)]
              transition-all duration-500 hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="h-60 bg-white flex items-center justify-center">
                <img
                  src={p.thumbnail || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-full object-contain p-4 
                  transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Details */}
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-orange-800 font-[Playfair]">
                  {title}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  {p.category}
                  {p.subCategory ? ` • ${p.subCategory}` : ""}
                </p>

                {/* Price Section */}
                <div className="mt-3">
                  <span className="text-lg font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full shadow">
                    ₹{p.discountPrice || p.price}
                  </span>

                  {p.discountPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{p.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🔱 Bottom Border */}
      <ScrollingBorder />
    </div>
  );
}
