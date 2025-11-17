// src/components/Hero.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Convert hex → rgba
function hexToRgba(hex: string, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Hero() {
  const slides = [
    {
      title: "Discover Sacred Temples",
      text: "Explore ancient temples & divine places across India.",
      btnText: "Explore Temples",
      link: "/temples",
      color: "#2E1503",
      img: "https://images.pexels.com/photos/3731615/pexels-photo-3731615.jpeg",
    },
    {
      title: "Book Authentic Pujas",
      text: "Perform rituals done by verified priests.",
      btnText: "Book Puja",
      link: "/pujas",
      color: "#3B1A03",
      img: "https://images.pexels.com/photos/5729118/pexels-photo-5729118.jpeg",
    },
    {
      title: "Support with Donation",
      text: "Help temples, trusts & seva activities flourish.",
      btnText: "Donate Now",
      link: "/donate",
      color: "#550000",
      img: "https://images.pexels.com/photos/23953117/pexels-photo-23953117.jpeg",
    },
    {
      title: "Spiritual Products",
      text: "Pure malas, idols & sacred items at your doorstep.",
      btnText: "Shop Now",
      link: "/products",
      color: "#2A0F0F",
      img: "https://images.pexels.com/photos/33800985/pexels-photo-33800985.jpeg",
    },
    {
      title: "Aarti & Katha",
      text: "Read, listen & watch spiritual Aartis & Kathas.",
      btnText: "View Aarti",
      link: "/aarti",
      color: "#1A1A1A",
      img: "https://images.pexels.com/photos/28288480/pexels-photo-28288480.jpeg",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden select-none">

      {slides.map((s, index) => {
        const isActive = index === current;

        const strong = hexToRgba(s.color, 0.98);
        const transparent = "rgba(0,0,0,0)";

        // Main blend color → transparent
        const blendStyle = {
          background: `linear-gradient(
            to right,
            ${strong} 0%,
            ${strong} 38%,
            ${hexToRgba(s.color, 0.55)} 45%,
            ${transparent} 56%
          )`,
        };

        const diagonalStyle = {
          background:
            "linear-gradient(115deg, rgba(0,0,0,0.22) 0%, transparent 50%)",
        };

        return (
          <div
            key={index}
            className={`absolute inset-0 flex transition-opacity duration-[1000ms] ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* LEFT COLOR BLOCK (40%) */}
            <div
              className="w-[40%] h-full flex items-center px-10 md:px-16 relative"
              style={{ backgroundColor: s.color }}
            >
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                  {s.title}
                </h1>

                <p className="mt-4 text-gray-200 text-lg md:text-xl">
                  {s.text}
                </p>

                <Link
                  to={s.link}
                  className="mt-8 inline-block bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:scale-[1.05] transition-all"
                >
                  {s.btnText}
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE (60%) */}
            <div className="w-[60%] h-full relative">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${s.img})`,
                  filter: "brightness(0.94)",
                }}
              />

              {/* The REAL blend */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={blendStyle}
              />

              {/* Premium diagonal fade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={diagonalStyle}
              />
            </div>
          </div>
        );
      })}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-orange-500 scale-125 shadow-lg"
                : "bg-white/60 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
