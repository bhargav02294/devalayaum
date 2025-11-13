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

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get<Product[]>(`${backendURL}/api/products?published=true`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [backendURL]);

  if (loading) return <p className="text-center mt-10 text-orange-700">Loading...</p>;

  if (products.length === 0)
    return <p className="text-center mt-10 text-gray-700">No products found.</p>;

  return (
    <div className="pt-24 pb-16 px-6 md:px-12 bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-orange-800 mb-10">
        🙏 Devotional & Spiritual Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled";
          return (
            <div
              key={p._id}
              className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
            >
              <img
                src={p.thumbnail || "/placeholder.jpg"}
                alt={title}
                className="h-56 w-full object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
                <p className="text-gray-600 text-sm mt-1">{p.category}</p>
                <div className="mt-2">
                  <span className="text-xl font-bold text-orange-700">
                    ₹{p.discountPrice || p.price}
                  </span>
                  {p.discountPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{p.price}
                    </span>
                  )}
                </div>
                <Link
                  to={`/products/${p._id}`}
                  className="block mt-4 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
