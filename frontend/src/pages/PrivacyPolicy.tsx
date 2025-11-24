export default function PrivacyPolicy() {
  return (
    <section
      className="pt-20 md:pt-28 pb-20 px-5 md:px-6 min-h-screen text-gray-800"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 30%, #ffffff 80%)",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6 text-center font-[Marcellus]">
          Privacy Policy
        </h1>

        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed mb-5 text-base md:text-lg font-[Poppins]">
          At{" "}
          <span className="font-semibold text-orange-700">Devalayaum</span>, we
          value your privacy and are committed to protecting your personal
          information. This policy explains how we collect, use, and safeguard
          your data when you use our platform.
        </p>

        {/* SECTION 1 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          1. Information We Collect
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          We may collect information such as your name, email address, phone
          number, location, and payment details when you donate, book pujas, or
          purchase spiritual products.
        </p>

        {/* SECTION 2 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          We use your information to process transactions, send confirmations,
          offer customer support, improve our services, and personalize your
          spiritual experience.  
          <strong> We never sell your data to third parties.</strong>
        </p>

        {/* SECTION 3 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          3. Payment Security
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          All online payments are securely handled by Razorpay using SSL
          encryption. We do not store your complete card or banking details on
          our servers.
        </p>

        {/* SECTION 4 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          4. Cookies
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          We use cookies to enhance your browsing experience, remember your
          preferences, and analyze website performance. You may disable cookies
          anytime in your browser settings.
        </p>

        {/* SECTION 5 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          5. Your Rights
        </h2>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          You have the right to access, update, or delete your personal data.
          For privacy concerns, feel free to contact us at{" "}
          <span className="text-orange-700 font-medium">
            contact@devalayaum.in
          </span>.
        </p>

        {/* SECTION 6 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-2 font-[Marcellus]">
          6. Updates to This Policy
        </h2>
        <p className="text-gray-700 mb-6 font-[Poppins] leading-relaxed">
          We may update this policy occasionally. Please review this page
          regularly to stay informed about any changes.
        </p>

        {/* FOOTNOTE */}
        <p className="mt-8 text-sm text-gray-500 text-center font-[Poppins]">
          Last updated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
