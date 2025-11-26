// E:\devalayaum\frontend\src\admin\pages\TempleForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";
import extractMessage from "../../utils/extractMessage";
import { AiOutlineUpload } from "react-icons/ai";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "mr", label: "मर" },
  { code: "ta", label: "த" },
  { code: "te", label: "తె" },
  { code: "bn", label: "ব" },
] as const;

type LangCode = typeof LANGS[number]["code"];
type Multilingual = Partial<Record<LangCode, string>>;

type NearbyPlace = {
  name: Multilingual;
  description: Multilingual;
};

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
  nearbyPlaces: NearbyPlace[];
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
  const [activeLang, setActiveLang] = useState<LangCode>(
    (i18n.language as LangCode) ?? "en"
  );
  const [loading, setLoading] = useState(false);

  // OCR / LLM loading state
  const [ocrLoading, setOcrLoading] = useState(false);

  const backendURL = import.meta.env.VITE_API_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const lang = activeLang;

  // SAFE multilingual getter
  const getMultiValue = (field: keyof FormState, langKey: LangCode) => {
    const value = form[field];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (value as Multilingual)[langKey] ?? "";
    }
    return "";
  };

  // SAFE multilingual setter
  const setMulti = (field: keyof FormState, langKey: LangCode, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Multilingual), [langKey]: value },
    }));
  };

  // -----------------------
// AUTO-FILL FEATURE
// -----------------------
const handleAutoFill = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!backendURL) {
    alert("Backend URL not configured.");
    return;
  }

  const token = localStorage.getItem("ADMIN_TOKEN");

  setOcrLoading(true);

  try {
    // 1) Send file to OCR API
    const fd = new FormData();
    fd.append("file", file);

    const ocrRes = await axios.post<{ rawText: string }>(
      `${backendURL}/api/ocr/temple`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const rawText = ocrRes?.data?.rawText || "";
    if (!rawText) throw new Error("OCR returned no text.");

    // 2) Send raw text to LLM Parser
    const llmRes = await axios.post<{ mapped: Partial<FormState> }>(
      `${backendURL}/api/llm/parse-temple`,
      { rawText },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const mapped = llmRes?.data?.mapped;
    if (!mapped) throw new Error("Parser returned no mapped data.");

    // 3) Merge into form safely
    setForm((prev) => {
      const merged = { ...prev, ...mapped } as FormState;

      if (!Array.isArray(merged.imageFiles)) merged.imageFiles = prev.imageFiles;
      if (!Array.isArray(merged.images)) merged.images = prev.images ?? [];
      if (!Array.isArray(merged.nearbyPlaces)) merged.nearbyPlaces = prev.nearbyPlaces;

      return merged;
    });

    alert("Temple details auto-filled successfully!");
  } catch (err) {
    console.error("Auto-fill error:", err);
    alert("Auto-fill failed: " + extractMessage(err));
  } finally {
    setOcrLoading(false);
    (e.target as HTMLInputElement).value = "";
  }
};

  // Fetch existing temple for editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        const res = await axios.get<Partial<FormState>>(
          `${backendURL}/api/temples/${id}`
        );
        const payload = res.data ?? {};
        setForm((prev) => ({ ...prev, ...payload }));
      } catch (err) {
        console.error("Load temple:", extractMessage(err));
        alert("Failed to load temple: " + extractMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, backendURL]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured. Check VITE_CLOUDINARY_* vars");
    }
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
      const uploadedUrls = [...(form.images || [])];

      // upload new files (if any)
      for (const f of form.imageFiles) {
        if (f) {
          const url = await uploadToCloudinary(f);
          uploadedUrls.push(url);
        }
      }

      const payload: Partial<FormState> = { ...form, images: uploadedUrls };

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
    } catch (err) {
      console.error("Save temple error:", err);
      alert("Save failed: " + extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{id ? "Edit Temple" : "Add New Temple"}</h2>

      {/* Language Tabs */}
      <div className="mb-4 flex gap-2">
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

      {/* AUTO-FILL FROM FILE */}
      <div className="border p-4 rounded-lg mb-6 bg-orange-50">
        <h3 className="font-bold mb-2 text-orange-700">Auto-Fill From File</h3>
        <p className="text-gray-700 mb-2">Upload PDF / Image / Word document containing temple details.</p>

        <label className="px-4 py-2 bg-orange-600 text-white rounded cursor-pointer inline-flex items-center gap-2">
          <AiOutlineUpload />
          {ocrLoading ? "Processing..." : "Upload & Auto-Fill"}
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
            hidden
            onChange={handleAutoFill}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Name ({lang})</label>
            <input
              value={getMultiValue("name", lang)}
              onChange={(e) => setMulti("name", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Location ({lang})</label>
            <input
              value={getMultiValue("location", lang)}
              onChange={(e) => setMulti("location", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <label>About ({lang})</label>
            <textarea
              value={getMultiValue("about", lang)}
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
              onChange={(e) => handleImageChange(i, e.target.files ? e.target.files[0] : null)}
              className="block mb-2"
            />
          ))}
        </div>

        {/* RELIGIOUS INFO */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
          <div>
            <label>Main Deity ({lang})</label>
            <input
              value={getMultiValue("mainDeity", lang)}
              onChange={(e) => setMulti("mainDeity", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Deity Description ({lang})</label>
            <textarea
              value={getMultiValue("deityDescription", lang)}
              onChange={(e) => setMulti("deityDescription", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Significance ({lang})</label>
            <textarea
              value={getMultiValue("significance", lang)}
              onChange={(e) => setMulti("significance", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>History ({lang})</label>
            <textarea
              value={getMultiValue("history", lang)}
              onChange={(e) => setMulti("history", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Architecture ({lang})</label>
            <input
              value={getMultiValue("architecture", lang)}
              onChange={(e) => setMulti("architecture", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Builder / Trust ({lang})</label>
            <input
              value={getMultiValue("builderOrTrust", lang)}
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
              value={getMultiValue("darshanTiming", lang)}
              onChange={(e) => setMulti("darshanTiming", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Morning Aarti</label>
            <input
              value={form.aartiTimings.morning}
              onChange={(e) =>
                setForm({ ...form, aartiTimings: { ...form.aartiTimings, morning: e.target.value } })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Shringar Aarti</label>
            <input
              value={form.aartiTimings.shringar}
              onChange={(e) =>
                setForm({ ...form, aartiTimings: { ...form.aartiTimings, shringar: e.target.value } })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Shayan Aarti</label>
            <input
              value={form.aartiTimings.shayan}
              onChange={(e) =>
                setForm({ ...form, aartiTimings: { ...form.aartiTimings, shayan: e.target.value } })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <label>Special Pooja Info ({lang})</label>
            <textarea
              value={getMultiValue("specialPoojaInfo", lang)}
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
              value={getMultiValue("dressCode", lang)}
              onChange={(e) => setMulti("dressCode", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Entry Rules ({lang})</label>
            <textarea
              value={getMultiValue("entryRules", lang)}
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
              value={getMultiValue("howToReach", lang)}
              onChange={(e) => setMulti("howToReach", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Nearest Airport ({lang})</label>
            <input
              value={getMultiValue("nearestAirport", lang)}
              onChange={(e) => setMulti("nearestAirport", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Nearest Railway ({lang})</label>
            <input
              value={getMultiValue("nearestRailway", lang)}
              onChange={(e) => setMulti("nearestRailway", lang, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Road Connectivity ({lang})</label>
            <input
              value={getMultiValue("roadConnectivity", lang)}
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
                  updated[i] = { ...updated[i], name: { ...(p.name || {}), [lang]: e.target.value } };
                  setForm({ ...form, nearbyPlaces: updated });
                }}
                className="border p-2 rounded"
              />
              <textarea
                placeholder={`Description (${lang})`}
                value={p.description?.[lang] || ""}
                onChange={(e) => {
                  const updated = [...form.nearbyPlaces];
                  updated[i] = { ...updated[i], description: { ...(p.description || {}), [lang]: e.target.value } };
                  setForm({ ...form, nearbyPlaces: updated });
                }}
                className="border p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end">
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : id ? "Update Temple" : "Save Temple"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
