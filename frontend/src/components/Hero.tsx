import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    const auto = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(auto);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">

      {/* BACKGROUND IMAGE (full) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${slide.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          filter: "brightness(0.92)",
        }}
      ></div>

      {/* LEFT COLOR OVERLAY */}
      <div
        className="absolute inset-y-0 left-0 w-[40%]"
        style={{
          backgroundColor: slide.color,
        }}
      ></div>

      {/* TRUE BLEND ZONE (this makes the magic fade) */}
      <div
        className="absolute inset-y-0 left-[35%] w-[20%] pointer-events-none"
        style={{
          background: `linear-gradient(
            to right,
            ${slide.color} 0%,
            rgba(0,0,0,0.0) 100%
          )`,
          mixBlendMode: "multiply",
        }}
      ></div>

      {/* TEXT CONTENT */}
      <div className="absolute inset-y-0 left-0 w-[40%] flex items-center px-10 md:px-16 z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {slide.title}
          </h1>

          <p className="mt-4 text-gray-300 text-lg md:text-xl">
            {slide.text}
          </p>

          <Link
            to={slide.link}
            className="mt-8 inline-block bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            {slide.btnText}
          </Link>
        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              current === idx
                ? "bg-orange-500 scale-125 shadow-lg"
                : "bg-white/60 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
