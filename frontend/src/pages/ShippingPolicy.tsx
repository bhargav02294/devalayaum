// E:\devalayaum\frontend\src\pages\ShippingPolicy.tsx

export default function ShippingPolicy() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-orange-100">
        <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">
          Shipping & Delivery Policy
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          At <span className="font-semibold text-orange-700">Devalayaum</span>,
          we strive to ensure your devotional and spiritual products reach you
          safely and promptly. This Shipping & Delivery Policy outlines our
          shipping process, timelines, and related terms.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          1. Shipping Coverage
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          We currently ship our products across India via trusted courier
          partners. International delivery will be introduced soon.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          2. Order Processing Time
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Orders are usually processed within <strong>1-3 business days</strong>.
          During festivals, sales, or special campaigns, processing time may
          extend slightly.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          3. Delivery Time
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Delivery timelines vary based on your location:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-5 space-y-2">
          <li>Metro Cities: 3-5 business days</li>
          <li>Other Cities: 5-8 business days</li>
          <li>Remote Areas: 8-10 business days</li>
        </ul>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          4. Shipping Charges
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Shipping is <strong>free</strong> for orders above ₹499.  
          For orders below ₹499, a nominal shipping charge of ₹49 may apply.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          5. Order Tracking
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Once your order is shipped, you’ll receive a tracking ID via email or
          WhatsApp. You can use it to track your shipment directly on our courier
          partner’s website.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          6. Damaged or Lost Packages
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          If your package arrives damaged or is lost in transit, please contact us
          within <strong>48 hours</strong> of delivery attempt at{" "}
          <a href="mailto:contact@devalayaum.in" className="text-orange-700 font-medium hover:underline">
            contact@devalayaum.in
          </a>.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          7. Returns & Refunds
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          We accept returns for damaged or defective items within <strong>7 days</strong> of
          delivery. Please refer to our <a href="/terms" className="text-orange-700 font-medium hover:underline">Terms & Conditions</a> for full refund policies.
        </p>

        <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-3">
          8. Contact Us
        </h2>
        <p className="text-gray-700 leading-relaxed">
          For any shipping or delivery related queries, please reach us at:
        </p>
        <div className="mt-3 text-gray-700">
          📍 Nashik, Maharashtra, India <br />
          📧 contact@devalayaum.in <br />
          📞 +91 9876543210
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Last updated on <strong>12 November 2025</strong>.
        </p>
      </div>
    </section>
  );
}
