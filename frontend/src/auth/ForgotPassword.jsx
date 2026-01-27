import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
  const [sentToEmail, setSentToEmail] = useState("");
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

      if (data.email) {
        setSentToEmail(data.email);
      }

      if (data.cooldown) {
        setCooldown(data.cooldown);
      }

      toast.success(data.message || "Reset link sent");
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
          className="bg-white rounded-2xl shadow-lg border p-8"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-primary">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {sentToEmail && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm text-center">
              Reset link has been sent to <b>{maskEmail(sentToEmail)}</b>
            </div>
          )}

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

          <p className="text-center mt-6 text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
