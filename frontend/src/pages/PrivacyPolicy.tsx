export default function PrivacyPolicy() {
  return (
    <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-orange-50 to-white min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-700 mb-8 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-700 leading-relaxed mb-4">
          At <span className="font-semibold text-orange-700">Devalayaum</span>, we value your privacy and are committed 
          to protecting your personal data. This policy explains how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We may collect personal information such as your name, email address, phone number, 
          and payment details when you donate, book pujas, or shop with us.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use your data to process transactions, send confirmations, provide support, and improve our services. 
          We never sell your information to third parties.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">3. Payment Security</h2>
        <p className="text-gray-700 mb-4">
          All payments are securely processed via Razorpay using SSL encryption. 
          We do not store your full card or bank details on our servers.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">4. Cookies</h2>
        <p className="text-gray-700 mb-4">
          We use cookies to enhance your browsing experience and analyze website performance. 
          You can disable cookies in your browser at any time.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">5. Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the right to access, correct, or delete your data. 
          For any privacy concerns, contact us at <span className="text-orange-700">contact@devalayaum.in</span>.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">6. Updates to This Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this policy periodically. Please review it regularly for any changes.
        </p>

        <p className="mt-10 text-sm text-gray-500 text-center">
          Last updated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
