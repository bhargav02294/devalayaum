// E:\devalayaum\frontend\src\admin\pages\PujaForm.tsx
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

interface Package {
  key: string;
  title: Multilingual;
  price: string;
  discountPrice: string;
  details: Multilingual;
  benefits: Multilingual;
  seatsIncluded: string;
}



interface PujaFormState {
  name: Multilingual;
  category: string;
  subCategory: string;
  deityAssociated: Multilingual;
  description: Multilingual;
  whyPerform: Multilingual;
  benefits: Multilingual;
  procedure: Multilingual;
  mantra: Multilingual;
  duration: string;
  materialsRequired: Multilingual;
  availableAt: Multilingual[];
  placesDescription: Multilingual;
  packages: Package[];
  imageFile: File | null;
  image: string;
  galleryFiles: (File | null)[];
  images: string[];
  videoUrl: string;
  price: string;
  discountPrice: string;
  pujaPackageType: string;
  availability: string;
  published: boolean;
}

export default function PujaForm() {
  const backendURL = import.meta.env.VITE_API_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<LangCode>(i18n.language as LangCode || "en");

  const [form, setForm] = useState<PujaFormState>({
    name: {},
    category: "",
    subCategory: "",
    deityAssociated: {},
    description: {},
    whyPerform: {},
    benefits: {},
    procedure: {},
    mantra: {},
    duration: "",
    materialsRequired: {},
    availableAt: [],
    placesDescription: {},
    packages: [
      { key: "individual", title: { en: "Individual Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "1" },
      { key: "partner", title: { en: "Partner Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "2" },
      { key: "family", title: { en: "Family Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "4" }
    ],
    imageFile: null,
    image: "",
    galleryFiles: [null, null, null, null, null],
    images: [],
    videoUrl: "",
    price: "",
    discountPrice: "",
    pujaPackageType: "",
    availability: "",
    published: true,
  });

  const lang = activeLang;

  // -----------------------------
  // SAFE multilingual getter
  // -----------------------------
 const getMultiValue = (field: keyof PujaFormState, langKey: LangCode) => {
  const val = form[field] as unknown;

  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    return (val as Multilingual)[langKey] || "";
  }
  return "";
};


  // -----------------------------
  // SAFE multilingual setter
  // -----------------------------
  const setMulti = (field: keyof PujaFormState, langKey: LangCode, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [langKey]: value }
    }));
  };

  // -----------------------------
  // Load Temples
  // -----------------------------

  // -----------------------------
  // Upload to Cloudinary
  // -----------------------------
  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary not configured");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");

    return data.secure_url;
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (form.imageFile) {
        imageUrl = await uploadToCloudinary(form.imageFile);
      }

      const gallery: string[] = [];
      for (const f of form.galleryFiles) {
        if (f) {
          const url = await uploadToCloudinary(f);
          gallery.push(url);
        }
      }

      const payload = {
        ...form,
        image: imageUrl,
        images: gallery,
        packages: form.packages.map(pkg => ({
          ...pkg,
          price: Number(pkg.price),
          discountPrice: Number(pkg.discountPrice),
          seatsIncluded: Number(pkg.seatsIncluded),
        })),
        price: Number(form.price) || undefined,
        discountPrice: Number(form.discountPrice) || undefined,
      };

      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.post(`${backendURL}/api/pujas`, payload, { headers });
      alert("✅ Puja saved successfully!");
      window.location.href = "/admin/pujas";

    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save puja.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-700">🕉️ Add / Edit Puja</h2>

      {/* Language Tabs */}
      <div className="mb-4 flex gap-2">
        {LANGS.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code as LangCode)}
            className={`px-3 py-1 rounded ${activeLang === l.code ? "bg-orange-600 text-white" : "bg-gray-200"}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Name ({lang})</label>
            <input
              value={getMultiValue("name", lang)}
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
              required
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
            <label>Deity Associated ({lang})</label>
            <input
              value={getMultiValue("deityAssociated", lang)}
              onChange={(e) => setMulti("deityAssociated", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Duration</label>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="e.g., 1 hour, 3 days"
            />
          </div>

          <div>
            <label>Availability</label>
            <input
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Spiritual Fields */}
        <div className="border p-4 rounded-lg grid grid-cols-2 gap-4">
          {["description", "whyPerform", "benefits", "procedure", "mantra", "materialsRequired"].map((fieldKey) => (
            <div key={fieldKey} className="col-span-2">
              <label className="font-semibold capitalize">
                {fieldKey.replace(/([A-Z])/g, " $1")} ({lang})
              </label>

              <textarea
                value={getMultiValue(fieldKey as keyof PujaFormState, lang)}
                onChange={(e) => setMulti(fieldKey as keyof PujaFormState, lang, e.target.value)}
                className="w-full border p-2 rounded h-28"
              />
            </div>
          ))}
        </div>

        {/* Temple / Location */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-orange-700 text-lg">
            🏯 Temple / Location (Where the Puja Can Be Performed)
          </h3>

          {form.availableAt.map((place, index) => (
            <div key={index} className="mb-4 border rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">Location {index + 1} ({lang})</label>

                {index > 0 && (
                  <button
                    type="button"
                    className="text-red-600 text-sm"
                    onClick={() => {
                      const updated = form.availableAt.filter((_, i) => i !== index);
                      setForm({ ...form, availableAt: updated });
                    }}
                  >
                    ✖ Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder={`Place Name (${lang.toUpperCase()})`}
                value={place?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.availableAt];
                  updated[index] = { ...(updated[index] || {}), [lang]: e.target.value };
                  setForm({ ...form, availableAt: updated });
                }}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setForm({ ...form, availableAt: [...form.availableAt, {} as Multilingual] })
            }
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            ➕ Add Another Location
          </button>

          <div className="mt-4">
            <label className="font-semibold block mb-1">
              Places Description ({lang})
            </label>
            <textarea
              value={getMultiValue("placesDescription", lang)}
              onChange={(e) => setMulti("placesDescription", lang, e.target.value)}
              className="w-full border p-2 rounded h-24"
              placeholder="Explain details about these places..."
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="border p-4 rounded-lg">
          <label>Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, imageFile: e.target.files ? e.target.files[0] : null })
            }
          />
        </div>

        {/* Gallery */}
        <div className="border p-4 rounded-lg">
          <label>Upload Gallery Images</label>
          {form.galleryFiles.map((_, i) => (
            <input
              key={i}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const updated = [...form.galleryFiles];
                updated[i] = e.target.files ? e.target.files[0] : null;
                setForm({ ...form, galleryFiles: updated });
              }}
              className="block mb-2"
            />
          ))}
        </div>

        {/* Video */}
        <div className="border p-4 rounded-lg">
          <label>Video URL</label>
          <input
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Packages */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-bold mb-3 text-orange-700 text-lg">📦 Packages</h3>

          {form.packages.map((pkg, i) => (
            <div key={pkg.key} className="border rounded-lg p-3 mb-4 bg-gray-50">
              <h4 className="font-semibold text-orange-700 mb-2">
                {pkg.key.toUpperCase()} PACKAGE
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Price"
                  value={pkg.price}
                  onChange={(e) => {
                    const updated = [...form.packages];
                    updated[i].price = e.target.value;
                    setForm({ ...form, packages: updated });
                  }}
                  className="border p-2 rounded"
                />

                <input
                  type="number"
                  placeholder="Discount Price"
                  value={pkg.discountPrice}
                  onChange={(e) => {
                    const updated = [...form.packages];
                    updated[i].discountPrice = e.target.value;
                    setForm({ ...form, packages: updated });
                  }}
                  className="border p-2 rounded"
                />

                <input
                  type="number"
                  placeholder="Seats Included"
                  value={pkg.seatsIncluded}
                  onChange={(e) => {
                    const updated = [...form.packages];
                    updated[i].seatsIncluded = e.target.value;
                    setForm({ ...form, packages: updated });
                  }}
                  className="border p-2 rounded"
                />
              </div>

              <label>Details ({lang})</label>
              <textarea
                value={pkg.details?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.packages];
                  updated[i].details = { ...pkg.details, [lang]: e.target.value };
                  setForm({ ...form, packages: updated });
                }}
                className="border p-2 rounded w-full h-20 mt-1"
              />

              <label>Benefits ({lang})</label>
              <textarea
                value={pkg.benefits?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.packages];
                  updated[i].benefits = { ...pkg.benefits, [lang]: e.target.value };
                  setForm({ ...form, packages: updated });
                }}
                className="border p-2 rounded w-full h-20 mt-1"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          {loading ? "Saving..." : "Save Puja"}
        </button>
      </form>
    </div>
  );
}
