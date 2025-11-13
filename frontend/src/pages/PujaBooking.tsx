// E:\devalayaum\frontend\src\pages\PujaBooking.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface PujaPackage {
  key: string;
  title: Record<string, string>;
  price?: number;
  discountPrice?: number;
  seatsIncluded?: number;
}

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  image?: string;
  packages?: PujaPackage[];
}

interface Member {
  fullName: string;
  dateOfBirth?: string;
  city?: string;
  rashi?: string;
  gotra?: string;
  specificWish?: string;
}

function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    if (anyErr.message) return String(anyErr.message);
    if (anyErr.response?.data?.message) return String(anyErr.response.data.message);
  }
  return "Something went wrong";
}

export default function PujaBooking() {
  const { id, pkgKey } = useParams<{ id: string; pkgKey: string }>();
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  const [puja, setPuja] = useState<Puja | null>(null);
  const [pkg, setPkg] = useState<PujaPackage | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("USER_TOKEN");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Puja>(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);

        const found = (res.data.packages || []).find((p: PujaPackage) => p.key === pkgKey);
        setPkg(found);

        // Initialize members based on package type
        let initialMembers = 1;
        if (found?.key === "partner") initialMembers = 2;
        else if (found?.key === "family") initialMembers = 4;

        setMembers(Array.from({ length: initialMembers }).map(() => ({ fullName: "" })));
      } catch (err: unknown) {
        console.error("Failed to load puja:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, pkgKey, backendURL]);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { fullName: "" }]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!token) {
      setError("Please sign in to book a puja.");
      return false;
    }
    if (!pkg) {
      setError("Invalid package.");
      return false;
    }
    for (let i = 0; i < members.length; i++) {
      if (!members[i].fullName || members[i].fullName.trim() === "") {
        setError(`Please enter full name for person ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        pujaId: id,
        packageKey: pkg!.key,
        members,
        notes,
      };
      await axios.post(`${backendURL}/api/puja-bookings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🙏 Booking saved successfully. We will contact you soon.");
      navigate("/my-account");
    } catch (err: unknown) {
      console.error("Booking failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;
  if (!puja || !pkg)
    return (
      <div className="pt-24 p-6">
        <p className="text-center text-red-600">Puja or package not found.</p>
      </div>
    );

  return (
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-orange-700 mb-2">{t(puja.name)}</h1>
        <p className="text-sm text-gray-600 mb-4">
          Package:{" "}
          <span className="font-semibold">{t(pkg.title) || pkg.key}</span> •{" "}
          <span className="text-lg font-bold text-green-700">
            ₹{pkg.discountPrice || pkg.price}
          </span>
        </p>

        {!token && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm">
              You must be signed in to book this puja.{" "}
              <Link to="/login" className="text-orange-600 underline">
                Login / Register
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">Participants</h3>
            <p className="text-sm text-gray-500">
              Fill details for each person in this booking.
            </p>
          </div>

          {/* Participants Fields */}
          {members.map((m, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Person {idx + 1}</h4>
                {pkg.key === "family" && members.length > 4 && (
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="text-sm text-red-600 underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Full name *</label>
                  <input
                    value={m.fullName}
                    onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Date of birth</label>
                  <input
                    type="date"
                    value={m.dateOfBirth || ""}
                    onChange={(e) => updateMember(idx, "dateOfBirth", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">City / Village</label>
                  <input
                    value={m.city || ""}
                    onChange={(e) => updateMember(idx, "city", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Rashi</label>
                  <input
                    value={m.rashi || ""}
                    onChange={(e) => updateMember(idx, "rashi", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Gotra (optional)</label>
                  <input
                    value={m.gotra || ""}
                    onChange={(e) => updateMember(idx, "gotra", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Specific Wish (optional)</label>
                  <input
                    value={m.specificWish || ""}
                    onChange={(e) => updateMember(idx, "specificWish", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add more members only for Family package */}
          {pkg.key === "family" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addMember}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                + Add family member
              </button>
              <p className="text-sm text-gray-600 self-center">
                You can add more members as needed.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Notes / Additional info</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Any additional details or requests..."
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !token}
              className="bg-orange-600 text-white px-6 py-2 rounded shadow disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Now"}
            </button>
            <Link to={`/pujas/${id}`} className="px-4 py-2 rounded border text-gray-700">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
