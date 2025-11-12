export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-orange-700 mb-4">🎉 Thank You!</h1>
        <p className="text-gray-700 mb-4">
          Your payment has been received successfully. 🙏
        </p>
        <p className="text-gray-600 mb-6">
          You will receive your order confirmation soon.
        </p>
        <a
          href="/products"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
