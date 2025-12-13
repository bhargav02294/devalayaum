// src/pages/PujaBooking.tsx
// FULL MULTILANGUAGE VERSION — CLEAN & ESLINT SAFE

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* --------------------------------------------------
   INTERFACES
-------------------------------------------------- */
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

/* --------------------------------------------------
   SAFE ERROR HANDLER (NO ANY)
-------------------------------------------------- */
function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";

  if (typeof err === "string") return err;

  if (typeof err === "object" && err !== null) {
    const e = err as {
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };

    if (typeof e.message === "string") return e.message;
    if (e.response?.data?.message && typeof e.response.data.message === "string")
      return e.response.data.message;
  }

  return "Something went wrong";
}

/* --------------------------------------------------
   SAFE MEMBER ACCESSOR
-------------------------------------------------- */
function getMemberValue(member: Member, field: keyof Member): string {
  const val = member[field];
  return typeof val === "string" ? val : "";
}

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */
export default function PujaBooking() {
  const { id, pkgKey } = useParams<{ id: string; pkgKey: string }>();
  const backendURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* LIVE MULTILANGUAGE SUPPORT */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const h = (lng: string) => setLang(lng);
    i18n.on("languageChanged", h);
    return () => i18n.off("languageChanged", h);
  }, []);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  const [puja, setPuja] = useState<Puja | null>(null);
  const [pkg, setPkg] = useState<PujaPackage | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("USER_TOKEN");

  /* --------------------------------------------------
     LOAD PUJA + SELECTED PACKAGE
  -------------------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Puja>(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);

        const found = (res.data.packages || []).find((p) => p.key === pkgKey);
        setPkg(found);

        let initialMembers = 1;
        if (found?.key === "partner") initialMembers = 2;
        else if (found?.key === "family") initialMembers = 4;

        setMembers(Array.from({ length: initialMembers }).map(() => ({ fullName: "" })));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, pkgKey, backendURL]);

  /* --------------------------------------------------
     MEMBER UPDATE HELPERS
  -------------------------------------------------- */
  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addMember = () => setMembers((prev) => [...prev, { fullName: "" }]);

  const removeMember = (index: number) =>
    setMembers((prev) => prev.filter((_, i) => i !== index));

  /* --------------------------------------------------
     VALIDATION
  -------------------------------------------------- */
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

  /* --------------------------------------------------
     SUBMIT BOOKING
  -------------------------------------------------- */
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      await axios.post(
        `${backendURL}/api/puja-bookings`,
        {
          pujaId: id,
          packageKey: pkg!.key,
          members,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🙏 Booking saved successfully. We will contact you soon.");
      navigate("/my-account");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  if (loading) return <p className="pt-24 text-center">Loading…</p>;

  if (!puja || !pkg)
    return (
      <div className="pt-24 p-6 text-center text-red-600">
        Puja or package not found.
      </div>
    );

  /* Multilingual Labels */
  const memberFields: Array<[keyof Member, Record<string, string>]> = [
    ["fullName", { en: "Full Name *", hi: "पूरा नाम *", mr: "पूर्ण नाव *" }],
    ["dateOfBirth", { en: "Date of Birth", hi: "जन्म तिथि", mr: "जन्मतारीख" }],
    ["city", { en: "City / Village", hi: "शहर / गाँव", mr: "शहर / गाव" }],
    ["rashi", { en: "Rashi", hi: "राशि", mr: "राशी" }],
    ["gotra", { en: "Gotra (optional)", hi: "गोत्र (वैकल्पिक)", mr: "गोत्र (ऐच्छिक)" }],
    [
      "specificWish",
      {
        en: "Specific Wish (optional)",
        hi: "विशेष कामना (वैकल्पिक)",
        mr: "विशिष्ट इच्छा (ऐच्छिक)",
      },
    ],
  ];

  return (
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-[Marcellus] text-orange-700 mb-2">
          {t(puja.name)}
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          {t({ en: "Package:", hi: "पैकेज:", mr: "पॅकेज:" })}{" "}
          <span className="font-semibold">{t(pkg.title) || pkg.key}</span> •{" "}
          <span className="text-lg font-bold text-green-700">
            ₹{pkg.discountPrice || pkg.price}
          </span>
        </p>

        {!token && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm">
              {t({
                en: "You must be logged in to book this puja.",
                hi: "यह पूजा बुक करने के लिए कृपया लॉगिन करें।",
                mr: "ही पूजा बुक करण्यासाठी कृपया लॉगिन करा.",
              })}{" "}
              <Link to="/login" className="text-orange-600 underline">
                {t({ en: "Login / Register", hi: "लॉगिन / रजिस्टर", mr: "लॉगिन / नोंदणी" })}
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-gray-800">
            {t({ en: "Participants", hi: "प्रतिभागी", mr: "सहभागी" })}
          </h3>

          {/* PARTICIPANTS */}
          {members.map((m, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">
                  {t({ en: "Person", hi: "व्यक्ति", mr: "व्यक्ती" })} {idx + 1}
                </h4>

                {pkg.key === "family" && members.length > 4 && (
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="text-sm text-red-600 underline"
                  >
                    {t({ en: "Remove", hi: "हटाएं", mr: "काढा" })}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memberFields.map(([field, labelObj]) => {
                  const label = t(labelObj);
                  return (
                    <div key={String(field)}>
                      <label className="block text-sm font-medium">{label}</label>

                      {field === "dateOfBirth" ? (
                        <input
                          type="date"
                          value={getMemberValue(m, field)}
                          onChange={(ev) => updateMember(idx, field, ev.target.value)}
                          className="w-full border p-2 rounded"
                        />
                      ) : (
                        <input
                          type="text"
                          value={getMemberValue(m, field)}
                          onChange={(ev) => updateMember(idx, field, ev.target.value)}
                          className="w-full border p-2 rounded"
                          placeholder={label}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ADD MEMBER (Family Package) */}
          {pkg.key === "family" && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addMember}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                + {t({ en: "Add family member", hi: "परिवार का सदस्य जोड़ें", mr: "कुटुंब सदस्य जोडा" })}
              </button>
            </div>
          )}

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium">
              {t({ en: "Notes / Additional info", hi: "नोट्स / अतिरिक्त जानकारी", mr: "नोट्स / अतिरिक्त माहिती" })}
            </label>
            <textarea
              value={notes}
              onChange={(ev) => setNotes(ev.target.value)}
              className="w-full border p-2 rounded"
              placeholder={t({
                en: "Any additional details or requests…",
                hi: "कोई अतिरिक्त विवरण या अनुरोध…",
                mr: "अतिरिक्त माहिती किंवा विनंती…",
              })}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !token}
              className="bg-orange-600 text-white px-6 py-2 rounded shadow disabled:opacity-60"
            >
              {submitting
                ? t({ en: "Booking…", hi: "बुकिंग हो रही है…", mr: "बुकिंग…" })
                : t({ en: "Book Now", hi: "अभी बुक करें", mr: "आता बुक करा" })}
            </button>

            <Link
              to={`/pujas/${id}`}
              className="px-4 py-2 rounded border text-gray-700"
            >
              {t({ en: "Cancel", hi: "रद्द करें", mr: "रद्द करा" })}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
