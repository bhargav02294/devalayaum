// MyAccount.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa"; // ✅ Add this line

type User = {
  _id?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  pincode?: string;
};

export default function MyAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${backendURL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile fetch failed:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("USER_TOKEN");
          localStorage.removeItem("auth_email");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [backendURL, navigate]);

  if (loading) return <p className="text-center mt-24">Loading your account...</p>;
  if (!user) {
    return (
      <div className="pt-24 text-center">
        <p className="text-gray-600">Not logged in.</p>
        <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded">Login</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-700 mb-6">My Account</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold">{user.fullName || user.email}</h2>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
        <p className="mt-3 text-gray-700">Phone: {user.phone || "—"}</p>
        <p className="text-gray-700">City / Address: {user.address || "—"}</p>

        <div className="mt-6 flex gap-3">
          <Link to="/profile" className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</Link>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("USER_TOKEN");
              localStorage.removeItem("auth_email");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* WhatsApp Contact Button (inline in My Account) */}
      <div className="mt-6 text-center">
        <a
          href="https://wa.me/7666210342?text=Namaste%20Devalayaum%20Team%2C%20I%20need%20help%20with%20my%20account."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp size={20} />
          Chat with Support
        </a>
      </div>

      {/* Future: Booking or order history can go here */}
    </div>
  );
}
