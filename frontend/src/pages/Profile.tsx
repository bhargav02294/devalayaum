// Profile.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) return;
    axios
      .get(`${backendURL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const d = res.data || {};
        setForm({
          fullName: d.fullName || "",
          phone: d.phone || "",
          gender: d.gender || "",
          dateOfBirth: d.dateOfBirth || "",
          address: d.address || "",
          pincode: d.pincode || "",
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("USER_TOKEN");
          localStorage.removeItem("auth_email");
          window.location.href = "/login";
        }
      });
  }, [backendURL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("USER_TOKEN");
      await axios.put(`${backendURL}/api/user/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">🪔 Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Mobile / WhatsApp", name: "phone", type: "text" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Address", name: "address", type: "text" },
            { label: "Pincode", name: "pincode", type: "text" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block font-medium mb-1 text-gray-700">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={(form as any)[f.name] || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1 text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white w-full py-2 rounded-lg hover:bg-orange-700 font-semibold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
