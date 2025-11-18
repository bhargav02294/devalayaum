// src/components/Hero.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const slides = [
    {
      title: "Discover Sacred Temples",
      text: "Explore ancient temples and divine places across India.",
      btn: "Explore Temples",
      link: "/temples",
      img: "/herotemple.png",
    },
    {
      title: "Book Authentic Pujas",
      text: "Perform rituals conducted by experienced verified priests.",
      btn: "Book Puja",
      link: "/pujas",
      img: "/heropuja.png",
    },
    {
      title: "Support with Donation",
      text: "Help temples, trusts and seva activities flourish.",
      btn: "Donate Now",
      link: "/donate",
      img: "/herodonation.png",
    },
    {
      title: "Spiritual Products",
      text: "Pure malas, idols and sacred items delivered to your home.",
      btn: "Shop Now",
      link: "/products",
      img: "/heroproduct.png",
    },
    {
      title: "Aarti, Katha & Mantra",
      text: "Read and listen to Aartis, Kathas and divine Mantras.",
      btn: "View Collection",
      link: "/aartis",
      img: "/heroaarti.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">

      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700
          ${current === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >

          {/* FULL IMAGE */}
          <img
            src={s.img}
            alt={s.title}
            className="w-full h-full object-cover"
          />

          {/* TEXT BOX – FIXED SAME PLACE FOR ALL */}
          <div className="absolute left-[6%] top-[25%] md:left-[10%] md:top-[30%] 
                          max-w-xl select-none">

            {/* TITLE – MARCELLUS */}
            <h1
              className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl"
              style={{ fontFamily: "'Marcellus', serif" }}
            >
              {s.title}
            </h1>

            {/* DESCRIPTION – MERRIWEATHER */}
            <p
              className="mt-4 text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-lg"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {s.text}
            </p>

            {/* PREMIUM BUTTON */}
            <Link
              to={s.link}
              className="
                inline-block mt-6 px-8 py-3 rounded-full text-white text-lg font-[Merriweather]
                bg-gradient-to-r from-orange-600 to-orange-700
                hover:from-orange-700 hover:to-orange-800
                shadow-[0_5px_25px_rgba(255,145,80,0.45)]
                transition-all
              "
            >
              {s.btn}
            </Link>
          </div>

        </div>
      ))}

      {/* INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all
              ${idx === current
                ? "bg-orange-500 scale-125"
                : "bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
