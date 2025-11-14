import React, { useState, useEffect } from "react";
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

interface Package {
  key: string;
  title: Multilingual;
  price: string;
  discountPrice: string;
  details: Multilingual;
  benefits: Multilingual;
  seatsIncluded: string;
}


interface Temple {
  _id: string;
  name: Record<string, string>;
}

export default function PujaForm() {
const backendURL = import.meta.env.VITE_API_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<string>(i18n.language || "en");
  const [temples, setTemples] = useState<Temple[]>([]);

  const [form, setForm] = useState({
    name: {} as Multilingual,
    category: "",
    subCategory: "",
    deityAssociated: {} as Multilingual,
    description: {} as Multilingual,
    whyPerform: {} as Multilingual,
    benefits: {} as Multilingual,
    procedure: {} as Multilingual,
    mantra: {} as Multilingual,
    duration: "",
    materialsRequired: {} as Multilingual,
    availableAt: [] as string[],
    placesDescription: {} as Multilingual,
    packages: [
      { key: "individual", title: { en: "Individual Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "1" },
      { key: "partner", title: { en: "Partner Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "2" },
      { key: "family", title: { en: "Family Puja" }, price: "", discountPrice: "", details: {}, benefits: {}, seatsIncluded: "4" },
    ] as Package[],
    imageFile: null as File | null,
    image: "",
    galleryFiles: [] as (File | null)[],
    images: [] as string[],
    videoUrl: "",
    price: "",
    discountPrice: "",
    pujaPackageType: "",
    availability: "",
    published: true,
  });

  const lang = activeLang;

  // Fetch temple list for dropdown
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/temples`);
        setTemples(res.data);
      } catch (err) {
        console.error("Failed to load temples:", err);
      }
    };
    fetchTemples();
  }, [backendURL]);

  const setMulti = (field: keyof typeof form, lang: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [lang]: value },
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary not configured");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (form.imageFile) imageUrl = await uploadToCloudinary(form.imageFile);

      const uploadedGallery: string[] = [];
      for (const f of form.galleryFiles) {
        if (f) {
          const url = await uploadToCloudinary(f);
          uploadedGallery.push(url);
        }
      }

      const payload = {
        ...form,
        image: imageUrl,
        images: uploadedGallery,
        packages: form.packages.map((p) => ({
          ...p,
          price: Number(p.price) || 0,
          discountPrice: Number(p.discountPrice) || 0,
          seatsIncluded: Number(p.seatsIncluded) || 1,
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
      alert("❌ Failed to save puja. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-700">🕉️ Add / Edit Puja</h2>

      {/* Language Tabs */}
      <div className="mb-4 flex gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-3 py-1 rounded ${
              activeLang === l.code ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
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
              value={form.deityAssociated?.[lang] || ""}
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
              placeholder="e.g., Mondays, Pradosh"
            />
          </div>
        </div>

        {/* Spiritual Fields */}
        <div className="border p-4 rounded-lg grid grid-cols-2 gap-4">
          {["description", "whyPerform", "benefits", "procedure", "mantra", "materialsRequired"].map(
            (field) => (
              <div key={field} className="col-span-2">
                <label className="font-semibold capitalize">
                  {field.replace(/([A-Z])/g, " $1")} ({lang})
                </label>
                <textarea
                  value={(form as any)[field]?.[lang] || ""}
                  onChange={(e) => setMulti(field as any, lang, e.target.value)}
                  className="w-full border p-2 rounded h-28"
                />
              </div>
            )
          )}
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
        placeholder={`Temple or Place Name (${lang.toUpperCase()})`}
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
      value={form.placesDescription?.[lang] || ""}
      onChange={(e) => setMulti("placesDescription", lang, e.target.value)}
      className="w-full border p-2 rounded h-24"
      placeholder="Describe the importance or history of these places..."
    />
  </div>
</div>


        {/* Images */}
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
          {[0, 1, 2, 3, 4].map((i) => (
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

        {/* Video URL */}
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
                  updated[i].details = { ...(pkg.details || {}), [lang]: e.target.value };
                  setForm({ ...form, packages: updated });
                }}
                className="border p-2 rounded w-full h-20 mt-1"
              />
              <label>Benefits ({lang})</label>
              <textarea
                value={pkg.benefits?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.packages];
                  updated[i].benefits = { ...(pkg.benefits || {}), [lang]: e.target.value };
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
