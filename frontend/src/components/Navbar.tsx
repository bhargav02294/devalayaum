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

  useEffect(() => {
    setToken(Boolean(localStorage.getItem("USER_TOKEN")));
  }, []);

  // ✅ Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur z-50 shadow-md border-b border-orange-200/40">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">

        {/* ✅ Logo + Name */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Devalayaum Logo"
            className="w-14 h-14 rounded-full shadow-md"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            Devalayaum
          </span>
        </Link>

        {/* ✅ Mobile Menu */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* ✅ Menu Links */}
        <ul
          className={`md:flex gap-8 text-gray-800 font-medium absolute md:static left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ${
            open ? "top-20 p-6 shadow-md border-t border-orange-200/40" : "-top-60"
          }`}
        >
          {/* ✅ Nav Links with Underline Animation */}
          {[
            ["Home", "/"],
            ["Temples", "/temples"],
            ["Pujas", "/pujas"],
            ["Donate", "/donations"],
            ["Products", "/products"],
            ["Aarti / Katha", "/aarti"],
            ["Our Donors", "/donors"],
            
          ].map(([name, link]) => (
            <li key={name}>
              <Link
                to={link}
                className="relative group"
              >
                <span className="hover:text-orange-700">{name}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}

          {/* ✅ Language Dropdown (Mobile Version) */}
          <li className="md:hidden mt-3">
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="border p-2 rounded w-full"
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

        {/* ✅ Right Icons Section */}
        <div className="hidden md:flex items-center gap-5">

          {/* ✅ Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
            >
              <Globe size={20} />
              <span className="text-sm">Language</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-orange-200 w-40 overflow-hidden">
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

          {/* ✅ Login / My Account with Icons */}
          {token ? (
            <>
              <button
                onClick={() => navigate("/my-account")}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-700"
              >
                <User size={20} />
                <span className="text-sm">My Account</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
