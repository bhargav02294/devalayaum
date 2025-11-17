// src/pages/PujaBooking.tsx
// PREMIUM PUJA BOOKING PAGE — Marcellus Title + Devotional Golden Theme
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

/**
 * Safe error extractor without using `any`.
 * Works with plain Error, axios-like errors, and unknown values.
 */
function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;

  // If it's an Error instance
  if (err instanceof Error) {
    return err.message || "Unknown error";
  }

  // If it's an object (e.g. axios error shape), narrow types explicitly
  if (typeof err === "object" && err !== null) {
    // Define a narrowed shape that we might expect
    type ErrShape = {
      message?: unknown;
      response?: { data?: { message?: unknown } } | unknown;
    };

    const maybe = err as ErrShape;

    if (typeof maybe.message === "string") return maybe.message;

    // try axios-style response.data.message
    const resp = maybe.response as { data?: { message?: unknown } } | undefined;
    if (resp?.data && typeof resp.data.message === "string") return resp.data.message;

    // fallback: try JSON stringify for debugging (but keep short)
    try {
      const s = JSON.stringify(err);
      return s.length > 200 ? s.slice(0, 200) + "..." : s;
    } catch {
      return "Unknown error";
    }
  }

  return "Something went wrong";
}

export default function PujaBooking() {
  const { id, pkgKey } = useParams<{ id: string; pkgKey: string }>();
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  const [puja, setPuja] = useState<Puja | null>(null);
  const [pkg, setPkg] = useState<PujaPackage | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("USER_TOKEN");
  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  const glow = "shadow-[0_10px_30px_rgba(140,85,40,0.15)]";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Puja>(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);

        const found = (res.data.packages || []).find((p) => p.key === pkgKey);
        setPkg(found);

        let initial = 1;
        if (found?.key === "partner") initial = 2;
        else if (found?.key === "family") initial = 4;

        setMembers(Array.from({ length: initial }).map(() => ({ fullName: "" })));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, pkgKey, backendURL]);

  const updateMember = (index: number, field: keyof Member, val: string) => {
    setMembers((prev) => {
      const c = [...prev];
      c[index] = { ...c[index], [field]: val };
      return c;
    });
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
      if (!members[i].fullName.trim()) {
        setError(`Please enter full name for person ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading…</p>;
  if (!puja || !pkg)
    return <p className="pt-24 text-center text-red-600">Puja or Package not found.</p>;

  return (
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#fff8ec] via-[#fffdf9] to-white min-h-screen">
      <div className={`max-w-4xl mx-auto bg-white rounded-3xl p-8 ${glow}`}>

        {/* Title */}
        <h1 className="text-4xl font-[Marcellus] text-orange-900 font-bold">
          {t(puja.name)}
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          Package:{" "}
          <span className="font-semibold">{t(pkg.title) || pkg.key}</span>
          {" • "}
          <span className="text-xl font-bold text-green-700">
            ₹{pkg.discountPrice || pkg.price}
          </span>
        </p>

        {/* Login Warning */}
        {!token && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <p>
              You must be signed in to book this puja.{" "}
              <Link to="/login" className="text-orange-600 underline font-medium">
                Login / Register
              </Link>
            </p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="mt-8 space-y-6">

          {/* Participants */}
          <div>
            <h3 className="text-xl font-semibold text-[#7a3c11] font-[Merriweather]">
              Participants Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add details of each person included in this puja.
            </p>
          </div>

          {members.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#fffaf5] border border-orange-100 rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-[#6b2f0f]">Person {idx + 1}</h4>

                {pkg.key === "family" && members.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setMembers((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
  ["fullName", "Full Name *"],
  ["dateOfBirth", "Date of Birth"],
  ["city", "City / Village"],
  ["rashi", "Rashi"],
  ["gotra", "Gotra (optional)"],
  ["specificWish", "Specific Wish (optional)"],
].map(([field, label]) => (
  <div key={field}>
    <label className="block text-sm font-medium">{label}</label>

    <input
      type={field === "dateOfBirth" ? "date" : "text"}
      value={getMemberValue(m, field as keyof Member)}
      onChange={(e) =>
        updateMember(idx, field as keyof Member, e.target.value)
      }
      className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>
))}

              </div>
            </div>
          ))}

          {/* Add More Members */}
          {pkg.key === "family" && (
            <button
              type="button"
              onClick={() => setMembers((prev) => [...prev, { fullName: "" }])}
              className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
            >
              + Add Family Member
            </button>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium">Notes / Additional Info</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1 h-28 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!token || submitting}
              className="bg-[#8a3c0f] text-white px-6 py-2 rounded-lg hover:bg-[#5e290d] disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Book Now"}
            </button>

            <Link
              to={`/pujas/${id}`}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
