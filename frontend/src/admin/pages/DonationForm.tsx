import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";

const languages = ["en", "hi", "mr", "ta", "te", "bn"];

export default function DonationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ✅ Local state for currently active language
  const [activeLang, setActiveLang] = useState(i18n.language || "en");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    thumbnail: "",
    templeName: { en: "" },
    address: { en: "" },
    templeDetails: { en: "" },
    shortDetails: { en: "" },
    donationName: { en: "" },
    description: { en: "" },
    summary: { en: "" },
    benefits: { en: "" },
  });

  // 🔹 Load existing donation
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await axios.get(`${backendURL}/api/donations/${id}`);
          setForm(res.data);
        } catch (err) {
          console.error("Failed to load donation:", err);
        }
      })();
    }
  }, [id, backendURL]);

  // 🔹 Multilingual field change
  const handleMultiChange = (field: string, langKey: string, value: string) => {
    setForm({
      ...form,
      [field]: { ...form[field as keyof typeof form], [langKey]: value },
    });
  };

  // 🔹 Image upload to Cloudinary
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setForm({ ...form, thumbnail: res.data.secure_url });
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("❌ Image upload failed.");
    }
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (id) {
        await axios.put(`${backendURL}/api/donations/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Donation updated successfully!");
      } else {
        await axios.post(`${backendURL}/api/donations`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Donation added successfully!");
      }
      navigate("/admin/donations");
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-yellow-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          {id ? "✏️ Edit Donation" : "🪔 Add Donation"}
        </h2>

        {/* 🌐 Language Switch */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {languages.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLang(l)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                activeLang === l
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🖼 Thumbnail */}
          <div>
            <label className="block font-semibold mb-2 text-orange-800">
              Temple Image / Thumbnail
            </label>
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg mb-3 border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* 🛕 Temple Details */}
          <h3 className="text-xl font-semibold text-orange-700 border-b pb-1">
            Temple Details
          </h3>
          {["templeName", "address", "templeDetails", "shortDetails"].map((field) => (
            <div key={field}>
              <label className="capitalize block font-medium mb-1">{field}</label>
              <input
                type="text"
                value={form[field as keyof typeof form]?.[activeLang] || ""}
                onChange={(e) => handleMultiChange(field, activeLang, e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}

          {/* 💰 Donation Details */}
          <h3 className="text-xl font-semibold text-orange-700 border-b pb-1 mt-4">
            Donation Details
          </h3>
          {["donationName", "description", "summary", "benefits"].map((field) => (
            <div key={field}>
              <label className="capitalize block font-medium mb-1">{field}</label>
              <textarea
                value={form[field as keyof typeof form]?.[activeLang] || ""}
                onChange={(e) => handleMultiChange(field, activeLang, e.target.value)}
                className="border p-2 rounded w-full"
                rows={field === "description" ? 3 : 2}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow-md w-full font-semibold"
          >
            {loading ? "Saving..." : "Save Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}
