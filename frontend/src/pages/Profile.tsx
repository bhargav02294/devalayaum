// Profile.tsx — Fully mobile-optimized and devotional styled
import { useEffect, useState } from "react";
import axios from "axios";

type ProfileForm = {
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  pincode: string;
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) return;

    axios
      .get(`${backendURL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <div
      className="pt-20 md:pt-24 min-h-screen flex justify-center px-5"
      style={{
        background:
          "linear-gradient(to bottom right, #fff4cc, #fff8e7, #ffffff)",
      }}
    >
      <div className="max-w-2xl w-full bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-orange-100 mt-4 mb-10">

        {/* PAGE TITLE */}
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center font-[Marcellus]">
          🪔 Edit Profile
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Mobile / WhatsApp", name: "phone", type: "text" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Address", name: "address", type: "text" },
            { label: "Pincode", name: "pincode", type: "text" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block font-semibold mb-1 text-gray-700 font-[Poppins]">
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name as keyof ProfileForm] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-orange-600 text-base font-[Poppins]"
              />
            </div>
          ))}

          {/* GENDER SELECT */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700 font-[Poppins]">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-orange-600 text-base font-[Poppins]"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded-xl text-lg font-semibold transition-all"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
