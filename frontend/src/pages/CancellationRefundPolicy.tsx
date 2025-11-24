export default function CancellationRefundPolicy() {
  return (
    <div
      className="pt-20 md:pt-24 pb-16 px-5 md:px-20 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 25%, #ffffff 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">

        {/* PAGE HEADING */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6 font-[Marcellus]">
          Cancellation & Refund Policy
        </h1>

        {/* INTRO */}
        <p className="text-gray-700 mb-5 text-base md:text-lg leading-relaxed font-[Poppins]">
          At <strong>Devalayaum</strong>, we strive to offer a smooth and divine spiritual
          experience. Since our services include temple donations, puja bookings,
          aarti offerings, and spiritual products, certain categories are
          non-refundable due to their devotional nature.
        </p>

        {/* SECTION 1 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-6 mb-2 font-[Marcellus]">
          1. Donations
        </h2>
        <p className="text-gray-700 mb-3 font-[Poppins] leading-relaxed">
          Donations made through Devalayaum are voluntary contributions for
          spiritual and religious purposes.
          <br />
          <strong>All donations are non-cancelable and non-refundable</strong>,
          except in the case of:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          <li>Duplicate payment</li>
          <li>Failed transaction where the amount was deducted</li>
        </ul>

        {/* SECTION 2 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-6 mb-2 font-[Marcellus]">
          2. Puja Booking
        </h2>
        <p className="text-gray-700 mb-3 font-[Poppins] leading-relaxed">
          Once a puja is booked and scheduled, priests and temple arrangements
          get confirmed.
          <br />
          Therefore, <strong>puja bookings cannot be cancelled</strong>.
        </p>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          However, rescheduling may be allowed in special cases if requested
          within <strong>12 hours</strong> of booking.
        </p>

        {/* SECTION 3 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-6 mb-2 font-[Marcellus]">
          3. Products (If Applicable)
        </h2>
        <p className="text-gray-700 mb-3 font-[Poppins] leading-relaxed">
          We accept product cancellation requests <strong>before dispatch only</strong>.
        </p>
        <p className="text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          Refunds cannot be issued once the product is shipped.
        </p>

        {/* SECTION 4 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-6 mb-2 font-[Marcellus]">
          4. Refund Processing
        </h2>
        <p className="text-gray-700 mb-3 font-[Poppins] leading-relaxed">
          If your refund request is approved, funds may take:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          <li>5–7 business days for Bank Account / UPI refunds</li>
          <li>2–5 business days for Wallet refunds</li>
        </ul>

        {/* SECTION 5 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-6 mb-2 font-[Marcellus]">
          5. Contact for Issues
        </h2>
        <p className="text-gray-700 mb-3 font-[Poppins] leading-relaxed">
          For refund concerns, incorrect payments, or service issues:
        </p>
        <ul className="ml-6 text-gray-700 mb-4 font-[Poppins] leading-relaxed">
          <li>📧 Email: contact@devalayaum.in</li>
          <li>📞 Phone: +91 9876543210</li>
        </ul>

        {/* FOOTNOTE */}
        <p className="text-gray-600 mt-8 italic text-sm md:text-base font-[Poppins]">
          *This policy follows Razorpay’s payment guidelines and applies to all
          contributions and bookings made on Devalayaum.*
        </p>
      </div>
    </div>
  );
}
