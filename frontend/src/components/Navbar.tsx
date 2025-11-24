import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogIn, LogOut, Globe } from "lucide-react";
import i18n from "../i18n";
import logo from "../assets/logo.png";

type LangCode = "en" | "hi" | "mr" | "ta" | "te" | "bn";

type MenuItem = Record<LangCode, string>;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [token, setToken] = useState(false);
  const lang = (i18n.language || "en") as LangCode;

  useEffect(() => {
    setToken(Boolean(localStorage.getItem("USER_TOKEN")));
  }, []);

  // close language dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("auth_email");
    setToken(false);
    closeMenu();
    navigate("/");
  };

  // menu labels with correct typing
  const menuText: Record<
    "home" | "temples" | "pujas" | "donations" | "products" | "aarti" | "donors",
    MenuItem
  > = {
    home: { en: "Home", hi: "होम", mr: "मुख्यपृष्ठ", ta: "முகப்பு", te: "హోమ్", bn: "হোম" },
    temples: { en: "Temples", hi: "मंदिर", mr: "मंदिरे", ta: "கோயில்கள்", te: "దేవాలయాలు", bn: "মন্দির" },
    pujas: { en: "Pujas", hi: "पूजा", mr: "पूजा", ta: "பூஜைகள்", te: "పూజలు", bn: "পূজা" },
    donations: { en: "Chadhava", hi: "चढ़ावा", mr: "चढावा", ta: "படையல்", te: "చడావా", bn: "চাদাভа" },
    products: { en: "Products", hi: "उत्पाद", mr: "उत्पादने", ta: "பொருட்கள்", te: "ఉత్పత్తులు", bn: "পণ্য" },
    aarti: { en: "Aarti / Katha", hi: "आरती / कथा", mr: "आरती / कथा", ta: "ஆரத்தி / கதை", te: "ఆర్తి / కథ", bn: "আরতি / কথা" },
    donors: { en: "Our Donors", hi: "हमारे दानदाता", mr: "आमचे दाते", ta: "நன்கொடையாளர்", te: "విరాళ దాతలు", bn: "দাতা" },
  };

  // translation helper (fully safe)
  const t = (obj: MenuItem) => obj[lang] ?? obj["en"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur z-50 shadow-md border-b border-orange-200/40 h-[65px] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <img src={logo} alt="Devalayaum Logo" className="w-12 h-12 rounded-full shadow-md" />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-700 to-yellow-500 bg-clip-text text-transparent font-[Marcellus]">
            Devalayaum
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10 text-gray-800 font-[Poppins] ml-10">
          <Link to="/" className="hover:text-orange-700">{t(menuText.home)}</Link>
          <Link to="/temples" className="hover:text-orange-700">{t(menuText.temples)}</Link>
          <Link to="/pujas" className="hover:text-orange-700">{t(menuText.pujas)}</Link>
          <Link to="/donations" className="hover:text-orange-700">{t(menuText.donations)}</Link>
          <Link to="/products" className="hover:text-orange-700">{t(menuText.products)}</Link>
          <Link to="/aarti" className="hover:text-orange-700">{t(menuText.aarti)}</Link>
          <Link to="/donors" className="hover:text-orange-700">{t(menuText.donors)}</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* LANGUAGE SWITCH */}
          <div className="hidden md:block relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
            >
              <Globe size={20} />
              <span className="text-sm">{lang.toUpperCase()}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 w-40 mt-2 bg-white shadow-lg rounded-xl border overflow-hidden z-50">
                {(["en", "hi", "mr", "te", "ta", "bn"] as LangCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      i18n.changeLanguage(code);
                      setLangOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-orange-100"
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP LOGIN/LOGOUT */}
          {token ? (
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={() => navigate("/my-account")}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
              >
                <User size={20} /> My Account
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU BELOW */}
      <div
        className={`md:hidden bg-white border-t border-orange-200 shadow-xl transition-all duration-300 overflow-hidden absolute top-[65px] left-0 w-full ${
          menuOpen ? "max-h-[600px] p-5" : "max-h-0 p-0"
        }`}
      >
        <ul className="flex flex-col gap-5 text-gray-800 font-[Poppins] text-lg">
          {(
            ["home", "temples", "pujas", "donations", "products", "aarti", "donors"] as const
          ).map((key) => (
            <li key={key}>
              <Link to={`/${key === "home" ? "" : key}`} onClick={closeMenu}>
                {t(menuText[key])}
              </Link>
            </li>
          ))}

          {/* LANGUAGE MOBILE */}
          <li>
            <select
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                closeMenu();
              }}
              className="border p-3 w-full rounded-lg"
              value={lang}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>

{/* Other Language options removed as per recent edits
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
              <option value="bn">Bengali</option>*/}
            </select>
          </li>

          {/* LOGIN / LOGOUT MOBILE */}
          {token ? (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/my-account");
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-700"
              >
                <User size={20} /> My Account
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition justify-center"
            >
              <LogIn size={20} /> Login
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}
