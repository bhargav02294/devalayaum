export default function CancellationRefundPolicy() {
  return (
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">
          Cancellation & Refund Policy
        </h1>

        <p className="text-gray-700 mb-4">
          At <strong>Devalayaum</strong>, we strive to offer a smooth and divine
          spiritual experience. Since our services include temple donations,
          puja bookings, aarti offerings, and spiritual products, certain
          categories are non-refundable as per the nature of the service.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
          1. Donations
        </h2>
        <p className="text-gray-700 mb-3">
          Donations made through Devalayaum are considered voluntary
          contributions for spiritual and religious purposes.
          <br />
          <strong>Donations are non-cancelable and non-refundable</strong>,
          except in the case of:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mb-3">
          <li>Duplicate payment</li>
          <li>Transaction failure where the amount was deducted</li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
          2. Puja Booking
        </h2>
        <p className="text-gray-700 mb-3">
          Once a puja is booked and scheduled, priests and temple arrangements
          are confirmed.
          <br />
          Therefore, <strong>puja bookings cannot be cancelled</strong>.
        </p>
        <p className="text-gray-700 mb-3">
          Rescheduling may be allowed in special cases. Please contact us
          within 12 hours of booking.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
          3. Products (If Applicable)
        </h2>
        <p className="text-gray-700 mb-3">
          We accept cancellation requests <strong>before dispatch only</strong>.
        </p>
        <p className="text-gray-700 mb-3">
          Refunds will not be issued once the product has been shipped.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
          4. Refund Processing
        </h2>
        <p className="text-gray-700 mb-3">If approved, refunds may take:</p>
        <ul className="list-disc ml-6 text-gray-700 mb-3">
          <li>5–7 business days for bank account / UPI</li>
          <li>2–5 business days for wallet refunds</li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
          5. Contact for Issues
        </h2>
        <p className="text-gray-700 mb-3">
          For refund concerns, incorrect payments, or assistance:
        </p>
        <ul className="text-gray-700 ml-6 mb-3">
          <li>📧 Email: contact@devalayaum.in</li>
          <li>📞 Phone: +91 9876543210</li>
        </ul>

        <p className="text-gray-700 mt-8 italic">
          *This policy is compliant with Razorpay’s guidelines and applies to
          all payments made on Devalayaum.*
        </p>
      </div>
    </div>
  );
}
