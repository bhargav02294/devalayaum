export default function TermsAndConditions() {
  return (
    <section
      className="pt-20 md:pt-28 pb-20 px-5 md:px-6 min-h-screen text-gray-800"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 30%, #ffffff 85%)",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-orange-100">

        {/* PAGE TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6 text-center font-[Marcellus]">
          Terms & Conditions
        </h1>

        {/* INTRO PARAGRAPH */}
        <p className="text-gray-700 leading-relaxed mb-5 text-base md:text-lg font-[Poppins]">
          Welcome to{" "}
          <span className="font-semibold text-orange-700">Devalayaum</span>.  
          By accessing or using our platform, you agree to follow the terms and
          conditions outlined below. Please read them carefully before using any
          of our services, including donations, puja bookings, or spiritual product
          purchases.
        </p>

        {/* SECTION 1 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          By using our website, you confirm that you are legally capable of entering
          into binding contracts and agree to comply with all Terms & Conditions.
        </p>

        {/* SECTION 2 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          2. Donations & Payments
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          All donations made through Devalayaum are processed through secure payment
          systems, including Razorpay.  
          Once a donation or puja booking is confirmed, it is{" "}
          <strong>non-refundable</strong> except in the case of transaction errors.
        </p>

        {/* SECTION 3 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          3. Temple Associations
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          We collaborate with verified temples and trusts. However, the performance
          of rituals, pujas, or aartis is carried out directly by the temple
          authorities as per their traditions, customs, and timing.
        </p>

        {/* SECTION 4 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          4. User Conduct
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          Users agree not to misuse the platform, attempt unauthorized access,
          upload harmful content, or engage in unlawful behavior. Any violation may
          result in account suspension.
        </p>

        {/* SECTION 5 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          5. Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          Devalayaum is not liable for any indirect, incidental, or consequential
          damages resulting from platform use, third-party errors, or ritual delays
          by temple authorities.
        </p>

        {/* SECTION 6 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          6. Modifications
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          We may revise these Terms & Conditions at any time. Continuing to use the
          platform after changes means you accept the updated terms.
        </p>

        {/* FOOTNOTE */}
        <p className="mt-10 text-sm text-gray-500 text-center font-[Poppins]">
          Last updated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
