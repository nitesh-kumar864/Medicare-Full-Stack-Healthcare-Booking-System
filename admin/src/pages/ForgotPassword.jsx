import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { ButtonLoader } from "../components/Loader";
import { AdminContext } from "../context/AdminContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);


const handleForgotPassword = async (e) => {
  e.preventDefault();

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    setError("Email is required");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const { data } = await axios.post(
      backendUrl + "/api/doctor/forgot-password",
      { email: normalizedEmail }
    );

    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setSentEmail(normalizedEmail);
    // Only run when the backend confirms success.
    setIsSent(true);
    toast.success(data.message || "Reset link has been sent");
    setEmail("");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Something went wrong. Try again later"
    );
  } finally {
    setLoading(false);
  }
};



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
                    placeholder="Email"
                    value={email}
                    error={error}
                    onChange={(e) => {
                      setError("");
                      setEmail(e.target.value.toLowerCase());
                    }}
                  />

                  <motion.button
                    whileHover={{ scale: loading  ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 h-12 bg-primary text-white rounded-lg
                shadow flex items-center justify-center gap-3
                disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && <ButtonLoader />}
                    <span>
                      {loading
                        ? "Sending..."
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
                  <b>{sentEmail || "your registered email"}</b>, you will receive a
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
