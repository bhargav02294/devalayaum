import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";

interface Product {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  thumbnail?: string;
  published?: boolean;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(`${backendURL}/api/products`);
        setProducts(res.data);
      } catch {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendURL]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.delete(`${backendURL}/api/products/${id}`, { headers });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Product deleted successfully!");
    } catch {
      alert("❌ Failed to delete product.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-orange-700">
        Loading products...
      </p>
    );

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-orange-700">🛍️ Spiritual Products</h2>
        <Link
          to="/admin/products/new"
          className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700 transition"
        >
          ➕ Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const title = p.name?.[lang] || p.name?.en || "Untitled";

            return (
              <div
                key={p._id}
                className="border border-orange-200 rounded-xl shadow-md hover:shadow-lg bg-white transition-all overflow-hidden"
              >
                <img
                  src={p.thumbnail || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-700 mb-1">{title}</h3>
                  <p className="text-gray-700">{p.category}</p>

                  {p.subCategory && (
                    <p className="text-sm text-gray-500">Subcategory: {p.subCategory}</p>
                  )}

                  <p className="mt-2 text-lg font-bold text-gray-800">
                    ₹{p.discountPrice || p.price}
                    {p.discountPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{p.price}
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-gray-600 mb-3">Stock: {p.stock}</p>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/admin/products/edit/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
