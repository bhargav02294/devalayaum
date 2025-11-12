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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language || "en";
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
    return (
      <p className="text-center py-10 text-gray-600">Loading products…</p>
    );

  if (products.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No spiritual products available.
      </p>
    );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">
      {/* Title */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          Sacred Spiritual Products
        </h2>
        <p className="mt-3 text-gray-600 text-lg">
          Handpicked divine items filled with blessings and purity
        </p>
      </div>

      {/* Product Grid - 3 big centered cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {products.map((p) => {
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
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={p.thumbnail || p.images?.[0] || "/placeholder.jpg"}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />

                {/* Tag */}
                <div className="absolute top-3 left-3 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md">
                  Spiritual
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

                {/* Price Section */}
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

                {/* Buy Now Button */}
                <Link
                  to={`/products/${p._id}`}
                  className="block text-center w-full bg-[#b35b00] hover:bg-[#8f4500] text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link
          to="/products"
          className="relative inline-block group px-5 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-semibold text-sm overflow-hidden transition-all duration-500"
        >
          {/* sliding background */}
          <span
            className="absolute left-0 top-0 w-0 h-full bg-[#b35b00] transition-all duration-700 group-hover:w-full"
          ></span>

          {/* text */}
          <span className="relative z-10 group-hover:text-white transition-all duration-500">
            View All Products
          </span>
        </Link>
      </div>
    </section>
  );
}
