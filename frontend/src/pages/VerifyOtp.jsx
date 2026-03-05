import { useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { ButtonLoader } from "../components/Loader";

const VerifyOtp = () => {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { name, username, email, password, from } = location.state || {};

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const redirectTo = from || "/";

  if (!email) {
    navigate("/signup");
    return null;
  }

  // -------- OTP INPUT --------
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      const newCode = ["", "", "", "", "", ""];

      for (let i = 0; i < 6; i++) {
        newCode[i] = digits[i] || "";
      }

      setCode(newCode);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, 6).split("");

    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = digits[i] || "";
    }
    setCode(newCode);

    inputRefs.current[Math.min(digits.length, 5)]?.focus();
    e.preventDefault();
  };

  // -------- VERIFY OTP --------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = code.join("");

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/signup/verify-otp",
        { name, username, email, password, otp }
      );

      if (data.success) {
        toast.success("Account created successfully");
        localStorage.setItem("token", data.token);
        setToken(data.token);
       navigate(redirectTo);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8"
        >
          <h2 className="text-3xl font-bold text-center text-primary mb-3">
            Verify Your Email
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-bold
                    border-2 rounded-lg outline-none
                    focus:border-primary"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white font-bold rounded-lg
                flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <ButtonLoader />}
              Verify OTP
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp;
