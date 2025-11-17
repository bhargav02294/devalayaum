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
    <div className="relative w-full h-[80vh] overflow-hidden">

      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex transition-opacity duration-[1300ms] ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* LEFT COLOR SIDE */}
          <div
            className="w-[40%] h-full flex items-center px-10 md:px-16 relative"
            style={{ backgroundColor: s.color }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {s.title}
              </h1>

              <p className="mt-4 text-gray-300 text-lg md:text-xl">
                {s.text}
              </p>

              <Link
                to={s.link}
                className="mt-8 inline-block bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
              >
                {s.btnText}
              </Link>
            </div>

            {/* FADE RIGHT EDGE OF COLOR */}
            <div
              className="absolute top-0 right-0 h-full w-20 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${s.color}, transparent)`,
              }}
            />
          </div>

          {/* RIGHT IMAGE SIDE */}
          <div className="w-[60%] h-full relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${s.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.92)",
              }}
            />

            {/* FADE LEFT EDGE OF IMAGE TO BLEND INTO COLOR */}
            <div
              className="absolute top-0 left-0 h-full w-40 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(0,0,0,0.25))",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      ))}

      {/* INDICATORS */}
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
