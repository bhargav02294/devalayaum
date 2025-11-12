// E:\devalayaum\frontend\src\admin\pages\Dashboard.tsx
import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Donations</p>
          <p className="text-3xl font-bold">₹50,000</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Products</p>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Registered Temples</p>
          <p className="text-3xl font-bold">34</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Users</p>
          <p className="text-3xl font-bold">789</p>
        </div>
      </div>
    </div>
  );
}
