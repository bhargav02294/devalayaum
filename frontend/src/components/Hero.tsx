// src/components/Hero.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const slides = [
    {
      title: "Discover Sacred Temples",
      text: "Explore ancient temples & divine places across India.",
      btnText: "Explore Temples",
      link: "/temples",
      img: "/herotemple.jpg",
    },
    {
      title: "Book Authentic Pujas",
      text: "Perform rituals done by verified priests.",
      btnText: "Book Puja",
      link: "/pujas",
      img: "/heropuja.jpg",
    },
    {
      title: "Support with Donation",
      text: "Help temples, trusts & seva activities flourish.",
      btnText: "Donate Now",
      link: "/donate",
      img: "/herodonation.jpg",
    },
    {
      title: "Spiritual Products",
      text: "Pure malas, idols & sacred items at your doorstep.",
      btnText: "Shop Now",
      link: "/products",
      img: "/heroproduct.jpg",
    },
    {
      title: "Aarti & Katha",
      text: "Read, listen & watch spiritual Aartis & Kathas.",
      btnText: "View Aarti",
      link: "/aarti",
      img: "/heroaarti.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">

      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700
            ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* BACKGROUND IMAGE (ONLY IMAGE) */}
          <img
            src={s.img}
            alt={s.title}
            className="w-full h-full object-cover"
          />

          {/* FIXED TEXT CONTAINER (Uniform alignment) */}
          <div className="absolute top-[20%] md:top-[24%] left-[5%] md:left-[7%] max-w-xl text-left select-none">

            {/* TITLE */}
            <h1
              className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl"
              style={{ fontFamily: "'Marcellus', serif" }}
            >
              {s.title}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-lg leading-relaxed"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {s.text}
            </p>

            {/* BUTTON – Golden Premium */}
            <Link
              to={s.link}
              className="
                inline-block mt-6 px-8 py-3 rounded-full text-white text-lg 
                bg-gradient-to-r from-orange-600 to-orange-700
                hover:from-orange-700 hover:to-orange-800
                shadow-[0_5px_25px_rgba(255,140,60,0.45)]
                transition-all
              "
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {s.btnText}
            </Link>
          </div>
        </div>
      ))}

      {/* BOTTOM INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all 
              ${i === current ? "bg-orange-500 scale-125" : "bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
