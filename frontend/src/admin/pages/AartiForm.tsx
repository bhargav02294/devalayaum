// E:\devalayaum\frontend\src\admin\pages\AartiForm.tsx
import React, { useState } from "react";
import axios from "axios";
import i18n from "../../i18n";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "mr", label: "मर" },
  { code: "ta", label: "த" },
  { code: "te", label: "తె" },
  { code: "bn", label: "ব" },
];

type LangCode = "en" | "hi" | "mr" | "ta" | "te" | "bn";
type Multilingual = Partial<Record<LangCode, string>>;
type AartiType = "aarti" | "katha" | "mantra";

interface FormState {
  title: Multilingual;
  description: Multilingual;
  content: Multilingual;
  meaning: Multilingual;
  imageFile: File | null;
  image: string;
  type: AartiType;
  temple: string;
  published: boolean;
}

export default function AartiForm() {
  const [form, setForm] = useState<FormState>({
    title: { en: "" },
    description: { en: "" },
    content: { en: "" },
    meaning: { en: "" },
    imageFile: null,
    image: "",
    type: "aarti",
    temple: "",
    published: true,
  });

  const [activeLang, setActiveLang] = useState<LangCode>(
    (i18n.language as LangCode) || "en"
  );
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.VITE_API_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 🔹 Helper: Safe multilingual getter
  const getText = (field: Multilingual) => field?.[activeLang] ?? "";

  // 🔹 Update multilingual field
  const setMulti = (field: keyof FormState, lang: LangCode, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [lang]: value },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      imageFile: e.target.files?.[0] || null,
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset)
      throw new Error("❌ Cloudinary not configured");

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(url, { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.en) {
      alert("Please provide English title");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.image;

      if (form.imageFile) {
        imageUrl = await uploadToCloudinary(form.imageFile);
      }

      const payload = {
        title: form.title,
        description: form.description,
        content: form.content,
        meaning: form.meaning,
        type: form.type,
        image: imageUrl,
        temple: form.temple || undefined,
        published: form.published,
      };

      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.post(`${backendURL}/api/aartis`, payload, { headers });

      alert("✅ Aarti saved successfully!");

      // Reset form
      setForm({
        title: { en: "" },
        description: { en: "" },
        content: { en: "" },
        meaning: { en: "" },
        imageFile: null,
        image: "",
        type: "aarti",
        temple: "",
        published: true,
      });
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Save failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🪔 Add / Edit Aarti</h2>

      {/* Language Tabs */}
      <div className="mb-3 flex gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code as LangCode)}
            className={`px-3 py-1 rounded ${
              activeLang === l.code ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold">
            Title ({activeLang.toUpperCase()})
          </label>
          <input
            value={getText(form.title)}
            onChange={(e) =>
              setMulti("title", activeLang, e.target.value)
            }
            className="w-full border p-2 rounded"
            required={activeLang === "en"}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-semibold">Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as AartiType,
              }))
            }
            className="w-full border p-2 rounded"
          >
            <option value="aarti">Aarti</option>
            <option value="katha">Katha</option>
            <option value="mantra">Mantra</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">
            Short Description ({activeLang.toUpperCase()})
          </label>
          <textarea
            value={getText(form.description)}
            onChange={(e) =>
              setMulti("description", activeLang, e.target.value)
            }
            className="w-full border p-2 rounded h-24"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold">
            Main Content ({activeLang.toUpperCase()})
          </label>
          <textarea
            value={getText(form.content)}
            onChange={(e) =>
              setMulti("content", activeLang, e.target.value)
            }
            className="w-full border p-2 rounded h-40"
          />
        </div>

        {/* Meaning (only for mantra) */}
        {form.type === "mantra" && (
          <div>
            <label className="block font-semibold">
              Meaning ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={getText(form.meaning)}
              onChange={(e) =>
                setMulti("meaning", activeLang, e.target.value)
              }
              className="w-full border p-2 rounded h-32"
            />
          </div>
        )}

        {/* Thumbnail */}
        <div>
          <label className="block font-semibold">Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="w-40 h-40 object-cover rounded mt-2"
            />
          )}
        </div>

        {/* Temple ID */}
        <div>
          <label className="block font-semibold">Temple ID (optional)</label>
          <input
            value={form.temple}
            onChange={(e) =>
              setForm((p) => ({ ...p, temple: e.target.value }))
            }
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Published */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((p) => ({ ...p, published: e.target.checked }))
            }
          />
          <span>Published</span>
        </label>

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Aarti"}
        </button>
      </form>
    </div>
  );
}
