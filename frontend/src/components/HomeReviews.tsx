import React from "react";

export default function HomeReviews() {
  // ✅ Reviews Array — 15 Items
  const reviews = [
    { name: "Ravi Sharma", location: "Delhi", text: "This platform brought me closer to spiritual peace." },
    { name: "Meena Deshpande", location: "Pune", text: "Very trustworthy, donations reached temple trusts." },
    { name: "Anil Kumar", location: "Hyderabad", text: "A divine experience. Puja booking was very smooth." },
    { name: "Kavita Joshi", location: "Jaipur", text: "Detailed temple information helped me a lot." },
    { name: "Ramesh Iyer", location: "Chennai", text: "Aarti and Katha content is truly elevating." },
    { name: "Suresh Patel", location: "Ahmedabad", text: "Very transparent donation system." },
    { name: "Vaishnavi Kulkarni", location: "Nashik", text: "Spiritually uplifting platform." },
    { name: "Prakash Singh", location: "Varanasi", text: "Beautiful design and seamless navigation." },
    { name: "Alka Verma", location: "Bhopal", text: "A calm and peaceful spiritual experience." },
    { name: "Harish Mehta", location: "Mumbai", text: "Powerful Aarti section, filled with devotion." },
    { name: "Sheetal Kumar", location: "Bangalore", text: "All services are authentic and organized." },
    { name: "Sanjay Rao", location: "Mangalore", text: "Donation processing is very smooth." },
    { name: "Poonam Sharma", location: "Udaipur", text: "Feeling blessed using this platform." },
    { name: "Mahesh Yadav", location: "Lucknow", text: "Good spiritual products and fast delivery." },
    { name: "Neha Taneja", location: "Chandigarh", text: "Very powerful interface and deep spiritual vibe." },
  ];

  // ✅ Duplicate reviews for smooth infinite scroll
  const infiniteScroll = [...reviews, ...reviews];

  return (
    <section
      className="relative py-44 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white tracking-wide">
            Devotee Reviews
          </h2>
          <p className="text-gray-300 mt-2 text-lg">
            Words from our beloved devotees
          </p>
        </div>

        {/* ✅ Infinite Scroll Row */}
        <div className="overflow-hidden whitespace-nowrap py-8">
          <div className="animate-scroll-slow inline-flex">
            {infiniteScroll.map((item, index) => (
              <div
                key={index}
                className="w-[380px] mx-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-gray-200 italic text-base leading-relaxed mb-6">
                  “{item.text}”
                </p>

                <h3 className="text-xl font-semibold text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-300">{item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
