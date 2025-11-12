// E:\devalayaum\frontend\src\admin\components\AdminNavbar.tsx
import React from "react";

export default function AdminNavbar() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome, Admin</span>
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Admin Avatar" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
}
