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
      text: "Explore ancient temples and divine places across India.",
      btnText: "Explore Temples",
      link: "/temples",
      color: "#2E1503",
      img: "/herotemple.png",
    },
    {
      title: "Book Authentic Pujas",
      text: "Perform rituals conducted by experienced, verified priests.",
      btnText: "Book Puja",
      link: "/pujas",
      color: "#3B1A03",
      img: "/heropuja.png",
    },
    {
      title: "Support with Donation",
      text: "Help temples, trusts and seva activities flourish.",
      btnText: "Donate Now",
      link: "/donate",
      color: "#4A1B02",
      img: "/herodonation.png",
    },
    {
      title: "Spiritual Products",
      text: "Pure malas, idols, yantras and sacred items at your doorstep.",
      btnText: "Shop Now",
      link: "/products",
      color: "#2A0F0F",
      img: "/heroproduct.png",
    },
    {
      title: "Aarti, Katha & Mantra",
      text: "Read and listen to sacred Aartis, Kathas and divine Mantras.",
      btnText: "View Collection",
      link: "/aartis",
      color: "#1A1A1A",
      img: "/heroaarti.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden select-none">

      {slides.map((s, index) => {
        const isActive = index === current;

        const strong = hexToRgba(s.color, 0.97);
        const transparent = "rgba(0,0,0,0)";

        const blendStyle = {
          background: `linear-gradient(
            to right,
            ${strong} 0%,
            ${strong} 42%,
            ${hexToRgba(s.color, 0.55)} 48%,
            ${transparent} 60%
          )`,
        };

        const diagonalStyle = {
          background:
            "linear-gradient(115deg, rgba(0,0,0,0.20) 0%, transparent 55%)",
        };

        return (
          <div
            key={index}
            className={`absolute inset-0 flex transition-opacity duration-[950ms] ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* LEFT TEXT SECTION */}
            <div
              className="w-[40%] h-full flex items-center px-10 md:px-16 relative"
              style={{ backgroundColor: s.color }}
            >
              <div className="max-w-lg">

                {/* MAIN TITLE — MARCELLUS */}
                <h1
                  className="text-4xl md:text-5xl text-white font-bold leading-tight drop-shadow-lg"
                  style={{ fontFamily: "'Marcellus', serif" }}
                >
                  {s.title}
                </h1>

                {/* SHORT DETAILS — MERRIWEATHER */}
                <p
                  className="mt-4 text-gray-200 text-lg md:text-xl leading-relaxed"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  {s.text}
                </p>

                {/* BUTTON — PREMIUM GOLDEN STYLE */}
                <Link
                  to={s.link}
                  className="
                    mt-7 inline-block
                    px-8 py-2.5
                    rounded-full text-lg text-white font-[Merriweather]
                    bg-gradient-to-r from-orange-600 to-orange-700
                    hover:from-orange-700 hover:to-orange-800
                    shadow-[0_5px_25px_rgba(255,145,80,0.45)]
                    transition-all
                  "
                >
                  {s.btnText}
                </Link>

              </div>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="w-[60%] h-full relative">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${s.img})`,
                  filter: "brightness(0.96)",
                }}
              />

              <div className="absolute inset-0" style={blendStyle}></div>
              <div className="absolute inset-0" style={diagonalStyle}></div>
            </div>
          </div>
        );
      })}

      {/* SLIDE INDICATORS */}
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
