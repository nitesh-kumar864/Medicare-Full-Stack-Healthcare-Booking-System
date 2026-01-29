import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { ButtonLoader } from "../components/Loader";
import { AppContext } from "../context/AppContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 5) {
      return local[0] + "***@" + domain;
    }

    return local.slice(0, 2) + "***" + local.slice(-3) + "@" + domain;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError("Email or Username is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { identifier }
      );
      setIsSent(true);

      // BEST PRACTICE: backend should send maskedEmail
      if (data?.maskedEmail) {
        setMaskedEmail(data.maskedEmail);
      }


      if (data?.cooldown) {
        setCooldown(data.cooldown);
      }

      toast.success(data.message || "Reset link has been sent");
      setIdentifier("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Something went wrong. Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="pt-24 flex justify-center">
      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-center text-primary">
              Forgot Password
            </h2>


            {!isSent ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>


                <form onSubmit={handleForgotPassword}>
                  <Input
                    icon={Mail}
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    error={error}
                    onChange={(e) => {
                      setError("");
                      setIdentifier(e.target.value.toLowerCase());
                    }}
                  />

                  <motion.button
                    whileHover={{ scale: loading || cooldown > 0 ? 1 : 1.02 }}
                    whileTap={{ scale: loading || cooldown > 0 ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="w-full mt-4 h-12 bg-primary text-white rounded-lg
                shadow flex items-center justify-center gap-3
                disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && <ButtonLoader />}
                    <span>
                      {loading
                        ? "Sending..."
                        : cooldown > 0
                          ? `Try again in ${cooldown}s`
                          : "Send Reset Link"}
                    </span>
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>

                <p className="text-gray-600 text-sm">
                  Reset link has been sent to{" "}
                  <b>{maskedEmail || "your registered email"}</b>, you will receive a
                  password reset link.
                </p>

              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-gray-50 flex justify-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:underline flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
