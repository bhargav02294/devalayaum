// E:\devalayaum\frontend\src\admin\pages\ProductForm.tsx
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

type Multilingual = Partial<Record<"en" | "hi" | "mr" | "ta" | "te" | "bn", string>>;

interface FormState {
  name: Multilingual;
  category: string;
  subCategory: string;
  description: Multilingual;
  material: string;
  spiritualBenefit: Multilingual;
  usageInstruction: Multilingual;
  deityAssociated: Multilingual;
  mantra: Multilingual;
  price: string;
  discountPrice: string;
  stock: string;
  images: string[];
  imageFiles: (File | null)[];
  thumbnailFile: File | null;
  thumbnail: string;
  videoUrl: string;
  dimensions: string;
  size: string;
  published: boolean;
}

export default function ProductForm() {
  const [form, setForm] = useState<FormState>({
    name: {},
    category: "",
    subCategory: "",
    description: {},
    material: "",
    spiritualBenefit: {},
    usageInstruction: {},
    deityAssociated: {},
    mantra: {},
    price: "",
    discountPrice: "",
    stock: "",
    images: [],
    imageFiles: [null, null, null, null, null],
    thumbnailFile: null,
    thumbnail: "",
    videoUrl: "",
    dimensions: "",
    size: "",
    published: true,
  });

  const [activeLang, setActiveLang] = useState<string>(i18n.language || "en");
  const [loading, setLoading] = useState(false);

const backendURL = import.meta.env.VITE_API_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 🌍 Helper: multilingual field setter
  const setMulti = (field: keyof FormState, lang: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [lang]: value },
    }));
  };

  // ☁️ Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured");
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(url, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  };

  // 🎯 Handle image uploads
  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...form.imageFiles];
    updated[index] = file;
    setForm({ ...form, imageFiles: updated });
  };

  // 🎯 Handle thumbnail file
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, thumbnailFile: file });
  };

  // 💾 Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImages = [...form.images];
      for (const f of form.imageFiles) {
        if (f) {
          const url = await uploadToCloudinary(f);
          uploadedImages.push(url);
        }
      }

      let thumbnailUrl = form.thumbnail;
      if (form.thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(form.thumbnailFile);
      }

      const payload = {
        name: form.name,
        category: form.category,
        subCategory: form.subCategory,
        description: form.description,
        material: form.material,
        spiritualBenefit: form.spiritualBenefit,
        usageInstruction: form.usageInstruction,
        deityAssociated: form.deityAssociated,
        mantra: form.mantra,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        stock: Number(form.stock),
        images: uploadedImages,
        thumbnail: thumbnailUrl,
        videoUrl: form.videoUrl,
        dimensions: form.dimensions,
        size: form.size,
        published: form.published,
      };

      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.post(`${backendURL}/api/products`, payload, { headers });
      alert("✅ Product saved successfully!");

      // Reset form
      setForm({
        name: {},
        category: "",
        subCategory: "",
        description: {},
        material: "",
        spiritualBenefit: {},
        usageInstruction: {},
        deityAssociated: {},
        mantra: {},
        price: "",
        discountPrice: "",
        stock: "",
        images: [],
        imageFiles: [null, null, null, null, null],
        thumbnailFile: null,
        thumbnail: "",
        videoUrl: "",
        dimensions: "",
        size: "",
        published: true,
      });
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const lang = activeLang;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🛍️ Add / Edit Product</h2>

      {/* 🌐 Language Tabs */}
      <div className="mb-3 flex gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-3 py-1 rounded ${
              activeLang === l.code ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🏷️ Basic Info */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Name ({lang.toUpperCase()})</label>
            <input
              value={form.name?.[lang] || ""}
              onChange={(e) => setMulti("name", lang, e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label>Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="e.g., Mala, Ring, Pendant"
            />
          </div>
          <div>
            <label>Subcategory</label>
            <input
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Material</label>
            <input
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* 🧘 Spiritual Info */}
        <div className="border p-4 rounded-lg grid grid-cols-2 gap-4">
          <div>
            <label>Spiritual Benefit ({lang})</label>
            <textarea
              value={form.spiritualBenefit?.[lang] || ""}
              onChange={(e) => setMulti("spiritualBenefit", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Usage Instruction ({lang})</label>
            <textarea
              value={form.usageInstruction?.[lang] || ""}
              onChange={(e) => setMulti("usageInstruction", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Deity Associated ({lang})</label>
            <input
              value={form.deityAssociated?.[lang] || ""}
              onChange={(e) => setMulti("deityAssociated", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Mantra ({lang})</label>
            <textarea
              value={form.mantra?.[lang] || ""}
              onChange={(e) => setMulti("mantra", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-2">
            <label>Description ({lang})</label>
            <textarea
              value={form.description?.[lang] || ""}
              onChange={(e) => setMulti("description", lang, e.target.value)}
              className="w-full border p-2 rounded h-32"
            />
          </div>
        </div>

        {/* 💰 Price & Stock */}
        <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg">
          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Discount Price (₹)</label>
            <input
              type="number"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* 📸 Images */}
        <div className="border p-4 rounded-lg">
          <label className="block font-semibold mb-2">Upload up to 5 Images</label>
          {[0, 1, 2, 3, 4].map((i) => (
            <input
              key={i}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(i, e.target.files?.[0] || null)}
              className="block mb-2"
            />
          ))}
        </div>

        {/* 🖼️ Thumbnail */}
        <div className="border p-4 rounded-lg">
          <label className="block font-semibold mb-2">Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Thumbnail Preview"
              className="w-40 h-40 object-cover rounded mt-2"
            />
          )}
        </div>

        {/* 📏 Other Details */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Video URL (optional)</label>
            <input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label>Dimensions (optional)</label>
            <input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Size (optional)</label>
            <input
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* ✅ Published */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          <span>Published</span>
        </label>

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
