export default function WhyChooseUs() {
  const items = [
    {
      title: "Verified Temple Partnerships",
      desc: "All rituals and donations are directly handled with authentic temple authorities.",
      icon: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png", // ✅ replace with your PNG icon OR remove images
    },
    {
      title: "Authentic Vedic Pujas",
      desc: "Certified priests perform rituals based on traditional scriptures.",
      icon: "https://cdn-icons-png.flaticon.com/128/17729/17729027.png",
    },
    {
      title: "Transparent Donation Flow",
      desc: "Every donation is traceable and directly supports temple activities.",
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371447.png",
    },
    {
      title: "Trusted by Devotees Nationwide",
      desc: "Thousands of devotees rely on our platform for spiritual services.",
      icon: "https://cdn-icons-png.flaticon.com/128/4371/4371076.png",
    },
    {
      title: "Secure Payments",
      desc: "Razorpay-powered encrypted payment gateway ensures total safety.",
      icon: "https://cdn-icons-png.flaticon.com/128/8984/8984290.png",
    },
    {
      title: "Multi-Language Spiritual Content",
      desc: "Aartis, Kathas & Mantras available in six regional languages.",
      icon: "https://cdn-icons-png.flaticon.com/128/3898/3898082.png",
    },
  ];

  return (
    <section className="relative py-20 bg-black">
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/spiritual-bg.jpg')" }}
      />

      {/* ✅ Subtle Black Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>

      {/* ✅ Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#E8C478] mb-6 tracking-wide">
          Why Choose Us
        </h2>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-14 leading-relaxed">
          We are committed to bringing authentic spiritual experiences, transparent donations,
          and temple connectivity on a trusted digital platform.
        </p>

        {/* ✅ Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-black/40 border border-[#9c6b2f] rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-500 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-16 w-16 object-contain opacity-90"
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-[#E2B76D] mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
