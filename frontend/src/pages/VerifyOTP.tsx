import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const navigate = useNavigate();

  useEffect(() => {
    const e = localStorage.getItem("auth_email") || "";
    setEmail(e);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return alert("Email and OTP required");
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/auth/verify-otp`, { email, otp });
      const token = res.data?.token;
      if (token) {
        // Save token for authenticated API calls
        localStorage.setItem("USER_TOKEN", token);
        alert("Login successful!");

        // ✅ After successful OTP verification
localStorage.setItem("USER_TOKEN", res.data.token);
localStorage.setItem("USER_ID", res.data.user.id);
localStorage.setItem("auth_email", res.data.user.email);
alert("✅ Login successful!");
navigate("/my-account");

      } else {
        alert("Verification succeeded but token missing.");
      }
    } catch (err: unknown) {
      console.error(err);
      alert("Invalid or expired OTP. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return alert("Missing email");
    try {
      await axios.post(`${backendURL}/api/auth/send-otp`, { email });
      alert("OTP resent. Check your email.");
    } catch (err) {
      console.error(err);
      alert("Resend failed");
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-start">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-700 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <strong>{email}</strong></p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full border p-3 rounded text-center tracking-widest text-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm">
          <button onClick={resend} className="text-orange-600 hover:underline">Resend OTP</button>
          <button onClick={() => { localStorage.removeItem("auth_email"); navigate("/login"); }} className="text-gray-600 hover:underline">
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}
