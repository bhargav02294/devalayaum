// E:\devalayaum\frontend\src\admin\pages\DonationForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";

// Supported languages
type LangCode = "en" | "hi" | "mr" | "ta" | "te" | "bn";
const languages: LangCode[] = ["en", "hi", "mr", "ta", "te", "bn"];

// Multilingual field type
type MultiLang = Partial<Record<LangCode, string>>;

// Donation form structure
interface DonationFormState {
  thumbnail: string;
  templeName: MultiLang;
  address: MultiLang;
  templeDetails: MultiLang;
  shortDetails: MultiLang;
  donationName: MultiLang;
  description: MultiLang;
  summary: MultiLang;
  benefits: MultiLang;
}

export default function DonationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_URL;

  // Active language typed properly
  const [activeLang, setActiveLang] = useState<LangCode>(
    (i18n.language as LangCode) || "en"
  );

  const [loading, setLoading] = useState(false);

  // Strongly typed form
  const [form, setForm] = useState<DonationFormState>({
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

  // Load existing donation for Edit mode
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load donation:", err);
      }
    })();
  }, [id, backendURL]);

  // ⭐ Safe multilingual setter
  const handleMultiChange = (field: keyof DonationFormState, lang: LangCode, value: string) => {
    const current = form[field] as MultiLang;

    setForm((prev) => ({
      ...prev,
      [field]: {
        ...current,
        [lang]: value,
      },
    }));
  };

  // ⭐ Safe multilingual getter
  const getMultiText = (field: keyof DonationFormState): string => {
    const value = form[field] as MultiLang;
    return value?.[activeLang] ?? "";
  };

  // Cloudinary Image Upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );

      setForm((prev) => ({ ...prev, thumbnail: res.data.secure_url }));
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("❌ Failed to upload image.");
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("ADMIN_TOKEN");

      if (id) {
        await axios.put(`${backendURL}/api/donations/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Donation updated!");
      } else {
        await axios.post(`${backendURL}/api/donations`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Donation added!");
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

        {/* Language Switch */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                activeLang === lang
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail */}
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

          {/* Temple Fields */}
          <h3 className="text-xl font-semibold text-orange-700 border-b pb-1">
            Temple Details
          </h3>

          {["templeName", "address", "templeDetails", "shortDetails"].map(
            (field) => (
              <div key={field}>
                <label className="capitalize block font-medium mb-1">
                  {field}
                </label>

                <input
                  type="text"
                  value={getMultiText(field as keyof DonationFormState)}
                  onChange={(e) =>
                    handleMultiChange(
                      field as keyof DonationFormState,
                      activeLang,
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            )
          )}

          {/* Donation Fields */}
          <h3 className="text-xl font-semibold text-orange-700 border-b pb-1 mt-4">
            Donation Details
          </h3>

          {["donationName", "description", "summary", "benefits"].map(
            (field) => (
              <div key={field}>
                <label className="capitalize block font-medium mb-1">
                  {field}
                </label>

                <textarea
                  value={getMultiText(field as keyof DonationFormState)}
                  onChange={(e) =>
                    handleMultiChange(
                      field as keyof DonationFormState,
                      activeLang,
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                  rows={field === "description" ? 3 : 2}
                />
              </div>
            )
          )}

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
