// MyAccount.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

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
      .get(`${backendURL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
      <div className="pt-20 md:pt-24 text-center px-6">
        <p className="text-gray-600 text-sm md:text-base">Not logged in.</p>
        <Link
          to="/login"
          className="inline-block mt-4 bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm md:text-base"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-14 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-orange-700 mb-6">
        My Account
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold">
          {user.fullName || user.email}
        </h2>

        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Email: {user.email}
        </p>

        <div className="mt-4 space-y-1 text-gray-700 text-sm md:text-base">
          <p>Phone: {user.phone || "—"}</p>
          <p>City / Address: {user.address || "—"}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
          <Link
            to="/profile"
            className="bg-blue-600 text-white px-4 py-2.5 rounded text-center text-sm"
          >
            Edit Profile
          </Link>

          <button
            className="bg-gray-200 px-4 py-2.5 rounded text-sm"
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

      {/* WhatsApp Contact Button */}
      <div className="mt-6 text-center">
        <a
          href="https://wa.me/7666210342?text=Namaste%20Devalayaum%20Team%2C%20I%20need%20help%20with%20my%20account."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition text-sm md:text-base"
        >
          <FaWhatsapp size={20} />
          Chat with Support
        </a>
      </div>
    </div>
  );
}
