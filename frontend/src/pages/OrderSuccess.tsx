import { useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const params = new URLSearchParams(useLocation().search);
  const orderId = params.get("orderId");

  return (
    <div className="pt-24 pb-20 text-center">
      <h1 className="text-3xl font-bold text-green-700">
        Payment Successful
      </h1>

      {orderId && (
        <p className="mt-4 text-gray-700">
          Order ID: <strong>{orderId}</strong>
        </p>
      )}

      <p className="mt-6 text-gray-600">
        Thank you for your donation 🙏
      </p>
    </div>
  );
}
