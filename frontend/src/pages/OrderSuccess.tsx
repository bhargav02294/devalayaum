import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderSuccess() {
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );

  const backendURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    if (!orderId) {
      setStatus("failed");
      return;
    }

    axios
      .get(`${backendURL}/api/payments/verify?orderId=${orderId}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("failed"));
  }, [backendURL]);

  if (status === "verifying") {
    return <p className="pt-24 text-center">Verifying payment...</p>;
  }

  if (status === "failed") {
    return <p className="pt-24 text-center text-red-600">Payment failed.</p>;
  }

  return (
    <div className="pt-24 text-center">
      <h1 className="text-2xl font-bold text-green-700">
        ✅ Donation Successful
      </h1>
      <p className="mt-2">Thank you for your contribution.</p>
    </div>
  );
}
