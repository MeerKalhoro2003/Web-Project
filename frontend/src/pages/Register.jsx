import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    cnic: "",
    phone: "",
    dateOfBirth: "",
  });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tempToken, setTempToken] = useState("");
  const [tempUser, setTempUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      setTempToken(res.data.data.token);
      setTempUser(res.data.data.user);
      setOtpMode(true);
      // In dev mode, we might log the OTP or display it. We assume user gets it via email.
      console.log("OTP:", res.data.data.otp);
      alert(`OTP sent to your email! (Demo mode: check console)`);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email: formData.email, otp });
      login(tempToken, { ...tempUser, isVerified: true });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error?.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          {otpMode ? "Verify your email" : "Create an account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        {!otpMode ? (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                CNIC (XXXXX-XXXXXXX-X)
              </label>
              <input
                name="cnic"
                type="text"
                required
                value={formData.cnic}
                onChange={handleChange}
                placeholder="12345-1234567-1"
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Phone
              </label>
              <input
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="03001234567"
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Date of Birth
              </label>
              <input
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 mt-6"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                6-Digit OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 text-center text-lg tracking-widest focus:ring-2 focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {!otpMode && (
          <p className="mt-10 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-primary-600 hover:text-primary-500"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
