

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

  return (
    <div className="relative w-full h-[100vh] overflow-hidden" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Main Slide Container */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex transition-opacity duration-[1500ms] ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* LEFT SOLID PART */}
          <div
            className="w-[45%] md:w-[40%] h-full flex flex-col justify-center px-10 md:px-20"
            style={{
              background: s.color,
            }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-wide drop-shadow-md">
              {s.title}
            </h1>

            <p className="mt-4 text-gray-300 text-lg md:text-xl tracking-wide">{s.text}</p>

            <Link
              to={s.link}
              className="mt-8 inline-block bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-8 py-3 rounded-full text-lg shadow-[0_4px_12px_rgba(255,165,0,0.4)] hover:shadow-[0_6px_18px_rgba(255,165,0,0.7)] transition-all duration-300 hover:scale-105 border border-white/20"
            >
              {s.btnText}
            </Link>
          </div>

          {/* RIGHT IMAGE SIDE */}
          <div
            className="w-[55%] md:w-[60%] h-full"
            style={{
              backgroundImage: `url(${s.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          {/* BEAUTIFUL CENTER BLEND */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0, 0, 0, 0)] via-transparent to-transparent pointer-events-none"></div>
        </div>
      ))}

      {/* BOTTOM CLICKABLE INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              current === index ? "bg-orange-500 scale-125 shadow-lg" : "bg-white/60 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
