import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.VITE_API_URL;
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
      const res = await axios.post(`${backendURL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      const token = res.data?.token;
      if (token) {
        // Save token + user info
        localStorage.setItem("USER_TOKEN", res.data.token);
        localStorage.setItem("USER_ID", res.data.user.id);
        localStorage.setItem("auth_email", res.data.user.email);

        alert("✅ Login successful!");
        navigate("/my-account");
      } else {
        alert("Verification succeeded but token missing.");
      }
    } catch (err) {
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
      alert("Failed to resend OTP.");
    }
  };

  return (
    <section
      className="min-h-screen pt-24 flex justify-center px-6 pb-10"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 45%, #ffffff 90%)",
      }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-orange-100">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-orange-700 mb-2 text-center font-[Marcellus]">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mb-5 text-center font-[Poppins]">
          A 6-digit code has been sent to <br />
          <strong className="text-orange-700">{email}</strong>
        </p>

        {/* OTP FORM */}
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full border p-3 rounded-xl shadow-sm text-center tracking-widest text-xl font-semibold font-[Poppins]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition font-[Poppins]"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>

        {/* ACTION LINKS */}
        <div className="mt-5 flex justify-between items-center text-sm font-[Poppins]">
          <button
            onClick={resend}
            className="text-orange-600 hover:underline font-medium"
          >
            Resend OTP
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("auth_email");
              navigate("/login");
            }}
            className="text-gray-600 hover:underline"
          >
            Change Email
          </button>
        </div>
      </div>
    </section>
  );
}
