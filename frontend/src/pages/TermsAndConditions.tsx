export default function TermsAndConditions() {
  return (
    <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-orange-50 to-white min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-700 mb-8 text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 leading-relaxed mb-4">
          Welcome to <span className="font-semibold text-orange-700">Devalayaum</span>. 
          By accessing or using our platform, you agree to abide by the following terms and conditions.
          Please read these carefully before making any donations, bookings, or purchases.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By using this website, you confirm that you are legally capable of entering into binding contracts and agree to comply with these terms.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">2. Donations & Payments</h2>
        <p className="text-gray-700 mb-4">
          All donations made through our platform are processed via secure payment gateways like Razorpay.
          Once a donation or booking is confirmed, it is non-refundable except in cases of transaction errors.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">3. Temple Associations</h2>
        <p className="text-gray-700 mb-4">
          We partner with verified temples and trusts. However, the temple authorities are responsible 
          for performing the pujas, rituals, or aartis as per their traditions.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">4. User Conduct</h2>
        <p className="text-gray-700 mb-4">
          Users must not misuse the platform for unlawful purposes, post offensive content, 
          or attempt to disrupt the services.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">5. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          Devalayaum will not be responsible for any indirect, incidental, or consequential damages 
          arising from the use of this platform or delays in transactions.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">6. Modifications</h2>
        <p className="text-gray-700 mb-4">
          We may update or revise these terms at any time. Continued use of the platform 
          after such changes constitutes your acceptance of the new terms.
        </p>

        <p className="mt-10 text-sm text-gray-500 text-center">
          Last updated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
