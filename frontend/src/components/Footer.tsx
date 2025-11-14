import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-orange-50 to-white text-gray-800 pt-16 pb-10 mt-20 border-t border-orange-200/40">
      <div className="container mx-auto px-6">
        {/* ✅ Logo + Spiritual Text */}
        <div className="flex flex-col items-center text-center mb-12">
          <img
            src={logo}
            alt="Devalayaum Logo"
            className="w-20 h-20 rounded-full shadow-md mb-4"
          />
          <p className="text-lg font-semibold text-orange-700">
            एक दिव्य आध्यात्मिक यात्रा का अनुभव करें
          </p>
          <p className="text-sm text-gray-700 mt-2 max-w-2xl">
            <span className="font-semibold text-orange-700">Devalayaum</span> —
            Your trusted platform for temple donations, puja services,
            aartis, products, and divine experiences. We bring devotion
            closer to your home.
          </p>
        </div>

        {/* ✅ Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* ✅ Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-orange-700 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Our Donors", "/donors"],
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Terms & Conditions", "/terms"],
                ["Privacy Policy", "/privacy"],
                ["Shipping Policy", "/shipping"],
                ["Cancellation & Refunds", "/cancellation-refund"],


              ].map(([name, link]) => (
                <li key={name}>
                  <Link
                    to={link}
                    className="relative group hover:text-orange-700 transition"
                  >
                    {name}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-orange-700 mb-4">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start gap-5">
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-700 hover:text-orange-700 transition transform hover:scale-110"
              >
                <Instagram size={26} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-700 hover:text-orange-700 transition transform hover:scale-110"
              >
                <Facebook size={26} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-700 hover:text-orange-700 transition transform hover:scale-110"
              >
                <Twitter size={26} />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Stay connected for daily spiritual content.
            </p>
          </div>

          {/* ✅ Contact Details */}
          <div>
            <h3 className="text-xl font-semibold text-orange-700 mb-4">
              Contact Us
            </h3>
            <ul className="text-sm space-y-1">
              <li>📍 Nashik, Maharashtra, India</li>
              <li>📧 contact@devalayaum.in</li>
              <li>📞 +91 9876543210</li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Available on WhatsApp: 9 AM – 7 PM
            </p>
          </div>
        </div>

        {/* ✅ Bottom Line */}
        <div className="text-center mt-12 pt-6 border-t border-orange-300/40">
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-3 text-sm text-gray-700">
            <Link
              to="/terms"
              className="hover:text-orange-700 hover:underline transition"
            >
              Terms & Conditions
            </Link>
            <span className="hidden md:inline text-gray-500">|</span>
            <Link
              to="/privacy"
              className="hover:text-orange-700 hover:underline transition"
            >
              Privacy Policy
            </Link>
          </div>

          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()}{" "}
            <span className="text-orange-700 font-semibold">Devalayaum</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
