// E:\devalayaum\frontend\src\admin\components\AdminSidebar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("adminToken"); // ✅ Correct key
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 h-screen">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>

      <nav className="flex flex-col space-y-3">
        <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/admin/products" className="hover:text-blue-600">Products</Link>
        <Link to="/admin/donations" className="hover:text-blue-600">Donations</Link>
        <Link to="/admin/temples" className="hover:text-blue-600">Temples</Link>
        <Link to="/admin/pujas" className="hover:text-blue-600">Pujas</Link>

        <Link to="/admin/aartis" className="hover:text-blue-600">
          Aartis / Kathas / Stories
        </Link>

        <button
          onClick={handleLogout}
          className="text-red-500 text-left hover:text-red-700 transition"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
