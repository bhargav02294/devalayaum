import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
    const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED

  const navigate = useNavigate();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/auth/send-otp`, { email });
      alert("OTP sent to your email. Check inbox / spam.");
      // Store the email so Verify page can use it
      localStorage.setItem("auth_email", email);
      navigate("/verify-otp");
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-start">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">🔐 Sign in / Register</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your email to receive a one-time code (OTP).</p>

        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          We’ll send you a 6-digit code. No password required.
        </p>
      </div>
    </div>
  );
}
