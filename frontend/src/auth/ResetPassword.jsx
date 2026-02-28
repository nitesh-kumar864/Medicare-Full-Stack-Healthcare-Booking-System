import { useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../components/Input";
import { ButtonLoader } from "../components/Loader";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.includes(" ")) {
      newErrors.password = "Password must not contain spaces";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }


    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + `/api/user/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success("Password reset successful.");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired reset link"
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
          className="bg-white rounded-2xl shadow-lg border p-8"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-primary">
            Reset Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setErrors({ ...errors, password: "" });
                setPassword(e.target.value);
              }}

            />
            {/* Confirm Password */}
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => {
                setErrors({ ...errors, confirmPassword: "" });
                setConfirmPassword(e.target.value);
              }}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-primary font-medium hover:underline"
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-12 bg-primary text-white rounded-lg
                shadow flex items-center justify-center gap-3
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <ButtonLoader />}
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Go back to{" "}
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

export default ResetPassword;
