export default function ShippingPolicy() {
  return (
    <section
      className="min-h-screen py-20 md:py-24 px-5 md:px-6"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 30%, #ffffff 80%)",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-orange-100">

        {/* PAGE TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-700 mb-8 font-[Marcellus]">
          Shipping & Delivery Policy
        </h1>

        {/* INTRO */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 font-[Poppins]">
          At{" "}
          <span className="font-semibold text-orange-700">Devalayaum</span>, we
          ensure that your  products are packed with
          care and delivered to you safely. This Shipping & Delivery Policy
          explains our shipping process and timelines.
        </p>

        {/* SECTION 1 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          1. Shipping Coverage
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          We currently ship  products across India through trusted
          courier partners.  
          <br />
          International delivery will be introduced soon.
        </p>

        {/* SECTION 2 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          2. Order Processing Time
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          Orders are usually processed within{" "}
          <strong>1–3 business days</strong>.  
          During festivals or large campaigns, processing time may increase
          slightly.
        </p>

        {/* SECTION 3 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          3. Delivery Time
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3 font-[Poppins]">
          Delivery times based on your location:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-5 space-y-1 font-[Poppins]">
          <li>Metro Cities: 3–5 business days</li>
          <li>Other Cities: 5–8 business days</li>
          <li>Remote Areas: 8–10 business days</li>
        </ul>

        {/* SECTION 4 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          4. Shipping Charges
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          Shipping is <strong>free</strong> for orders above ₹499.  
          <br />
          Orders below ₹499 may include a small shipping fee of ₹49.
        </p>

        {/* SECTION 5 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          5. Order Tracking
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          After your order is dispatched, you will receive a tracking link on
          WhatsApp or email.  
          You can track the shipment on the courier partner’s website.
        </p>

        {/* SECTION 6 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          6. Damaged or Lost Packages
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          If your package is damaged or lost in transit, please notify us within{" "}
          <strong>48 hours</strong> at{" "}
          <a
            href="mailto:contact@devalayaum.in"
            className="text-orange-700 font-medium hover:underline"
          >
            contact@devalayaum.in
          </a>.
        </p>

        {/* SECTION 7 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          7. Returns & Refunds
        </h2>
        <p className="text-gray-700 leading-relaxed mb-5 font-[Poppins]">
          Returns for damaged or defective items are accepted within{" "}
          <strong>7 days</strong> of delivery.  
          Please check our{" "}
          <a
            href="/terms"
            className="text-orange-700 font-medium hover:underline"
          >
            Terms & Conditions
          </a>{" "}
          for detailed refund rules.
        </p>

        {/* SECTION 8 */}
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mt-8 mb-3 font-[Marcellus]">
          8. Contact Us
        </h2>
        <p className="text-gray-700 leading-relaxed font-[Poppins]">
          For shipping or delivery queries:
        </p>
        <div className="mt-3 text-gray-700 font-[Poppins]">
          📍 Nashik, Maharashtra, India <br />
          📧 devalayaum@gmail.com.in <br />
          📞 +91 7666210342
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-sm text-gray-500 mt-10 font-[Poppins]">
          Last updated on <strong>28 November 2025</strong>.
        </p>
      </div>
    </section>
  );
}
