// Footer.tsx
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#fff6eb] to-white text-gray-800 pt-20 pb-10 mt-28 border-t border-orange-300/40">

      {/* ✨ Soft Top Divider */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">

        {/* 🔱 Logo Section */}
        <div className="text-center mb-12">
          <img
            src={logo}
            alt="Devalayaum Logo"
            className="w-24 h-24 mx-auto rounded-full shadow-xl border-4 border-white"
          />

          <h3 className="mt-4 text-2xl font-bold text-orange-700 tracking-wide font-[Judson]">
            Devalayaum
          </h3>

          <p className="text-gray-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Your trusted spiritual platform for Temples, Pujas, Donations, Aartis, and Divine Products.
          </p>
        </div>

        {/* 📌 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-10 text-center md:text-left">

          {/* 📍 Column 1 – Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-orange-700 mb-4 font-[Judson]">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["Temples", "/temples"],
                ["Pujas", "/pujas"],
                ["Aarti / Katha", "/aarti"],
                ["Donate", "/donations"],
                ["Products", "/products"],
              ].map(([name, link]) => (
                <li key={name}>
                  <Link
                    to={link}
                    className="text-gray-700 hover:text-orange-700 transition relative group"
                  >
                    {name}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Column 2 – Policies */}
          <div>
            <h4 className="text-xl font-semibold text-orange-700 mb-4 font-[Judson]">Policies</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Terms & Conditions", "/terms"],
                ["Privacy Policy", "/privacy"],
                ["Shipping Policy", "/shipping"],
                ["Cancellation & Refunds", "/cancellation-refund"],
              ].map(([name, link]) => (
                <li key={name}>
                  <Link
                    to={link}
                    className="text-gray-700 hover:text-orange-700 transition relative group"
                  >
                    {name}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Column 3 – Connect */}
          <div>
            <h4 className="text-xl font-semibold text-orange-700 mb-4 font-[Judson]">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-5 mb-4">
              <a href="#" className="hover:text-orange-700 transition transform hover:scale-110"><Instagram size={26} /></a>
              <a href="#" className="hover:text-orange-700 transition transform hover:scale-110"><Facebook size={26} /></a>
              <a href="#" className="hover:text-orange-700 transition transform hover:scale-110"><Twitter size={26} /></a>
              <a href="#" className="hover:text-orange-700 transition transform hover:scale-110"><Youtube size={26} /></a>
            </div>
            <p className="text-xs text-gray-500">Daily spiritual updates</p>
          </div>

          {/* 📍 Column 4 – Contact */}
          <div>
            <h4 className="text-xl font-semibold text-orange-700 mb-4 font-[Judson]">Contact Us</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>📍 Nashik, Maharashtra, India</li>
              <li>📧 contact@devalayaum.in</li>
              <li>📞 +91 9876543210</li>
            </ul>
            <p className="text-xs mt-3 text-gray-500">
              WhatsApp Support: 9 AM – 7 PM
            </p>
          </div>
        </div>

        {/* ✨ Bottom Section */}
        <div className="text-center mt-16 pt-6 border-t border-orange-200/60">
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} <span className="font-semibold text-orange-700">Devalayaum</span>. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
