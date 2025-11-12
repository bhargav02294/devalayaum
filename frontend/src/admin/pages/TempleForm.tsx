// E:\devalayaum\frontend\src\admin\pages\TempleForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";
import extractMessage from "../../utils/extractMessage";
import type { Temple } from "../../types/Temple";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "mr", label: "मर" },
  { code: "ta", label: "த" },
  { code: "te", label: "తె" },
  { code: "bn", label: "ব" },
];

type Multilingual = Partial<Record<"en" | "hi" | "mr" | "ta" | "te" | "bn", string>>;

type FormState = {
  name: Multilingual;
  location: Multilingual;
  about: Multilingual;
  images: string[];
  imageFiles: (File | null)[];
  mainDeity: Multilingual;
  deityDescription: Multilingual;
  significance: Multilingual;
  history: Multilingual;
  architecture: Multilingual;
  builderOrTrust: Multilingual;
  consecrationDate: string;
  darshanTiming: Multilingual;
  aartiTimings: { morning: string; shringar: string; shayan: string };
  specialPoojaInfo: Multilingual;
  dressCode: Multilingual;
  entryRules: Multilingual;
  prohibitedItems: string;
  lockerFacility: boolean;
  howToReach: Multilingual;
  nearestAirport: Multilingual;
  nearestRailway: Multilingual;
  roadConnectivity: Multilingual;
  mapLat: string;
  mapLng: string;
  nearbyPlaces: { name: Multilingual; description: Multilingual }[];
  published: boolean;
};

const createEmpty = (): FormState => ({
  name: {},
  location: {},
  about: {},
  images: [],
  imageFiles: [null, null, null, null, null],
  mainDeity: {},
  deityDescription: {},
  significance: {},
  history: {},
  architecture: {},
  builderOrTrust: {},
  consecrationDate: "",
  darshanTiming: {},
  aartiTimings: { morning: "", shringar: "", shayan: "" },
  specialPoojaInfo: {},
  dressCode: {},
  entryRules: {},
  prohibitedItems: "",
  lockerFacility: false,
  howToReach: {},
  nearestAirport: {},
  nearestRailway: {},
  roadConnectivity: {},
  mapLat: "",
  mapLng: "",
  nearbyPlaces: [{ name: {}, description: {} }],
  published: true,
});

export default function TempleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(createEmpty());
  const [activeLang, setActiveLang] = useState<string>(i18n.language || "en");
  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Fetch existing temple for editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<Temple>(`${backendURL}/api/temples/${id}`)
      .then((res) => {
        const d = res.data as any;
        setForm((prev) => ({ ...prev, ...d }));
      })
      .catch((err) => {
        console.error("Load temple:", extractMessage(err));
        alert("Failed to load temple: " + extractMessage(err));
      })
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  const setMulti = (field: keyof FormState, lang: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [lang]: value },
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset)
      throw new Error("Cloudinary not configured. Check VITE_CLOUDINARY_* vars");
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const r = await fetch(url, { method: "POST", body: fd });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...form.imageFiles];
    updated[index] = file;
    setForm({ ...form, imageFiles: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedUrls = [...form.images];
      for (const f of form.imageFiles) {
        if (f) {
          const url = await uploadToCloudinary(f);
          uploadedUrls.push(url);
        }
      }

      const payload = { ...form, images: uploadedUrls };
      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      if (id) {
        await axios.put(`${backendURL}/api/temples/${id}`, payload, { headers });
        alert("Temple updated successfully");
      } else {
        await axios.post(`${backendURL}/api/temples`, payload, { headers });
        alert("Temple created successfully");
      }

      navigate("/admin/temples");
    } catch (err: any) {
      console.error("Save temple error:", err);
      alert("Save failed: " + extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const lang = activeLang;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{id ? "Edit Temple" : "Add New Temple"}</h2>

      {/* Language Tabs */}
      <div className="mb-4 flex gap-2">
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
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Name ({lang})</label>
            <input
              value={form.name?.[lang] || ""}
              onChange={(e) => setMulti("name", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Location ({lang})</label>
            <input
              value={form.location?.[lang] || ""}
              onChange={(e) => setMulti("location", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-2">
            <label>About ({lang})</label>
            <textarea
              value={form.about?.[lang] || ""}
              onChange={(e) => setMulti("about", lang, e.target.value)}
              className="w-full border p-2 rounded h-28"
            />
          </div>
        </div>

        {/* IMAGE INPUTS */}
        <div className="border p-4 rounded-lg">
          <label className="block font-semibold mb-2">Upload 5 Images</label>
          {[0, 1, 2, 3, 4].map((i) => (
            <input
              key={i}
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(i, e.target.files ? e.target.files[0] : null)
              }
              className="block mb-2"
            />
          ))}
        </div>

        {/* RELIGIOUS INFO */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Main Deity ({lang})</label>
            <input
              value={form.mainDeity?.[lang] || ""}
              onChange={(e) => setMulti("mainDeity", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Deity Description ({lang})</label>
            <textarea
              value={form.deityDescription?.[lang] || ""}
              onChange={(e) => setMulti("deityDescription", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Significance ({lang})</label>
            <textarea
              value={form.significance?.[lang] || ""}
              onChange={(e) => setMulti("significance", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>History ({lang})</label>
            <textarea
              value={form.history?.[lang] || ""}
              onChange={(e) => setMulti("history", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Architecture ({lang})</label>
            <input
              value={form.architecture?.[lang] || ""}
              onChange={(e) => setMulti("architecture", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Builder / Trust ({lang})</label>
            <input
              value={form.builderOrTrust?.[lang] || ""}
              onChange={(e) => setMulti("builderOrTrust", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Consecration Date</label>
            <input
              value={form.consecrationDate}
              onChange={(e) => setForm({ ...form, consecrationDate: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        {/* Darshan & Aarti Info */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Darshan Timings ({lang})</label>
            <input
              value={form.darshanTiming?.[lang] || ""}
              onChange={(e) => setMulti("darshanTiming", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Morning Aarti</label>
            <input
              value={form.aartiTimings.morning}
              onChange={(e) =>
                setForm({
                  ...form,
                  aartiTimings: { ...form.aartiTimings, morning: e.target.value },
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Shringar Aarti</label>
            <input
              value={form.aartiTimings.shringar}
              onChange={(e) =>
                setForm({
                  ...form,
                  aartiTimings: { ...form.aartiTimings, shringar: e.target.value },
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Shayan Aarti</label>
            <input
              value={form.aartiTimings.shayan}
              onChange={(e) =>
                setForm({
                  ...form,
                  aartiTimings: { ...form.aartiTimings, shayan: e.target.value },
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-2">
            <label>Special Pooja Info ({lang})</label>
            <textarea
              value={form.specialPoojaInfo?.[lang] || ""}
              onChange={(e) => setMulti("specialPoojaInfo", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Visitor Info */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Dress Code ({lang})</label>
            <input
              value={form.dressCode?.[lang] || ""}
              onChange={(e) => setMulti("dressCode", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Entry Rules ({lang})</label>
            <textarea
              value={form.entryRules?.[lang] || ""}
              onChange={(e) => setMulti("entryRules", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Prohibited Items (comma separated)</label>
            <input
              value={form.prohibitedItems}
              onChange={(e) => setForm({ ...form, prohibitedItems: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-3">Locker Facility</label>
            <input
              type="checkbox"
              checked={form.lockerFacility}
              onChange={(e) => setForm({ ...form, lockerFacility: e.target.checked })}
            />
          </div>
        </div>

        {/* Travel Info */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>How to Reach ({lang})</label>
            <textarea
              value={form.howToReach?.[lang] || ""}
              onChange={(e) => setMulti("howToReach", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Nearest Airport ({lang})</label>
            <input
              value={form.nearestAirport?.[lang] || ""}
              onChange={(e) => setMulti("nearestAirport", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Nearest Railway ({lang})</label>
            <input
              value={form.nearestRailway?.[lang] || ""}
              onChange={(e) => setMulti("nearestRailway", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Road Connectivity ({lang})</label>
            <input
              value={form.roadConnectivity?.[lang] || ""}
              onChange={(e) => setMulti("roadConnectivity", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Latitude</label>
            <input
              value={form.mapLat}
              onChange={(e) => setForm({ ...form, mapLat: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Longitude</label>
            <input
              value={form.mapLng}
              onChange={(e) => setForm({ ...form, mapLng: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Nearby Places */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Nearby Places</h3>
          {form.nearbyPlaces.map((p, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 mb-3">
              <input
                placeholder={`Name (${lang})`}
                value={p.name?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.nearbyPlaces];
                  updated[i].name = { ...(p.name || {}), [lang]: e.target.value };
                  setForm({ ...form, nearbyPlaces: updated });
                }}
                className="border p-2 rounded"
              />
              <textarea
                placeholder={`Description (${lang})`}
                value={p.description?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.nearbyPlaces];
                  updated[i].description = {
                    ...(p.description || {}),
                    [lang]: e.target.value,
                  };
                  setForm({ ...form, nearbyPlaces: updated });
                }}
                className="border p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : id ? "Update Temple" : "Save Temple"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
