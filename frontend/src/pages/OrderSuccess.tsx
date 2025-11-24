export default function OrderSuccess() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 35%, #ffffff 80%)",
      }}
    >
      <div className="bg-white w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl border border-orange-100 text-center">

        {/* SUCCESS ICON */}
        <div className="text-5xl mb-4">🎉</div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-3 font-[Marcellus]">
          Thank You!
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-700 text-base md:text-lg mb-3 font-[Poppins]">
          Your payment has been received successfully. 🙏
        </p>
        <p className="text-gray-600 text-sm md:text-base mb-6 font-[Poppins]">
          A confirmation message will be shared with you shortly.
        </p>

        {/* BUTTON */}
        <a
          href="/products"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-base md:text-lg transition-all shadow-md font-[Poppins]"
        >
          Continue Shopping
        </a>
      </div>
    </section>
  );
}
