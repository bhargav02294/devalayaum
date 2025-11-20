import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogIn, LogOut, Globe } from "lucide-react";
import i18n from "../i18n";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState(false);
  const navigate = useNavigate();
  const lang = i18n.language || "en";

  useEffect(() => {
    setToken(Boolean(localStorage.getItem("USER_TOKEN")));
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("auth_email");
    setToken(false);
    navigate("/");
  };

  // 🌍 Multi-language text for menu
  const menuText: Record<string, Record<string, string>> = {
    home: {
      en: "Home",
      hi: "होम",
      mr: "मुख्यपृष्ठ",
      ta: "முகப்பு",
      te: "హోమ్",
      bn: "হোম",
    },
    temples: {
      en: "Temples",
      hi: "मंदिर",
      mr: "मंदिरे",
      ta: "கோயில்கள்",
      te: "దేవాలయాలు",
      bn: "মন্দির",
    },
    pujas: {
      en: "Pujas",
      hi: "पूजा",
      mr: "पूजा",
      ta: "பூஜைகள்",
      te: "పూజలు",
      bn: "পূজা",
    },
    chadhava: {
      en: "Chadhava",
      hi: "चढ़ावा",
      mr: "चढावा",
      ta: "படையல்",
      te: "చడావా",
      bn: "চাদাভা",
    },
    products: {
      en: "Products",
      hi: "उत्पाद",
      mr: "उत्पादने",
      ta: "பொருட்கள்",
      te: "ఉత్పత్తులు",
      bn: "পণ্য",
    },
    aarti: {
      en: "Aarti / Katha",
      hi: "आरती / कथा",
      mr: "आरती / कथा",
      ta: "ஆரத்தி / கதை",
      te: "ఆర్తి / కథ",
      bn: "আরতি / কথা",
    },
    donors: {
      en: "Our Donors",
      hi: "हमारे दानदाता",
      mr: "आमचे दाते",
      ta: "நன்கொடையாளர்",
      te: "విరాళ దాతలు",
      bn: "দাতা",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] || obj["en"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur z-50 shadow-md border-b border-orange-200/40 h-[65px] flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Devalayaum Logo" className="w-12 h-12 rounded-full shadow-md" />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-700 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            Devalayaum
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu */}
        <ul
          className={`md:flex gap-7 text-gray-800 font-medium absolute md:static left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ${
            open ? "top-16 p-6 shadow-md border-t border-orange-200/40" : "-top-60"
          }`}
        >
          <li><Link to="/" className="hover:text-orange-700">{t(menuText.home)}</Link></li>
          <li><Link to="/temples" className="hover:text-orange-700">{t(menuText.temples)}</Link></li>
          <li><Link to="/pujas" className="hover:text-orange-700">{t(menuText.pujas)}</Link></li>
          <li><Link to="/donations" className="hover:text-orange-700">{t(menuText.chadhava)}</Link></li>
          <li><Link to="/products" className="hover:text-orange-700">{t(menuText.products)}</Link></li>
          <li><Link to="/aarti" className="hover:text-orange-700">{t(menuText.aarti)}</Link></li>
          <li><Link to="/donors" className="hover:text-orange-700">{t(menuText.donors)}</Link></li>

          {/* Mobile Language Switch */}
          <li className="md:hidden mt-3">
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="border p-2 rounded w-full"
              value={lang}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
              <option value="bn">Bengali</option>
            </select>
          </li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-5">

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
            >
              <Globe size={20} /> <span className="text-sm capitalize">{lang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border w-40 overflow-hidden">
                {[
                  ["English", "en"],
                  ["Hindi", "hi"],
                  ["Marathi", "mr"],
                  ["Telugu", "te"],
                  ["Tamil", "ta"],
                  ["Bengali", "bn"],
                ].map(([label, code]) => (
                  <button
                    key={code}
                    onClick={() => {
                      i18n.changeLanguage(code);
                      setLangOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-orange-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login / Account Buttons */}
          {token ? (
            <>
              <button
                onClick={() => navigate("/my-account")}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
              >
                <User size={20} /> <span className="text-sm">My Account</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
