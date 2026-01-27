import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../components/Input";
import GoogleLoginPatient from "../components/GoogleLoginPatient";
import { ButtonLoader } from "../components/Loader";
import { AppContext } from "../context/AppContext";

const LoginPage = () => {
  const { backendUrl, setToken, loadUserProfileData, token, userData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  // STATES
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateFields = () => {
    let newErrors = {};

    if (!identifier.trim()) {
      newErrors.email = "Email or Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  //  Redirect if already logged in
  useEffect(() => {
    if (token && userData !== null) {
      navigate("/");
    }

  }, [token, userData]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions to continue");
      return;
    }

    if (!validateFields()) return;
    setIsLoading(true);

    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        identifier,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        await loadUserProfileData();

        toast.success("Login successful!");

        const params = new URLSearchParams(window.location.search);
        const redirectURL = params.get("redirect") || redirectTo;

        navigate(redirectURL);
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      toast.error(msg);


    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 flex justify-center">
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-lg border p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="text"
              placeholder="Email or Username"
              value={identifier}
              error={errors.email}
              onChange={(e) => {
                setErrors({ ...errors, email: "" });
                setIdentifier(e.target.value.toLowerCase());
              }}
            />

            <div className="mb-6">
              <div
                className={`relative flex items-center rounded-xl overflow-hidden 
                    ${errors.password ? "border-red-500 border" : "border-gray-300 border"}`}
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-emerald-600" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setErrors({ ...errors, password: "" });
                    setPassword(e.target.value);
                  }}
                  className="w-full bg-white py-3 pl-10 pr-12 text-gray-800 
                   placeholder-gray-500 outline-none"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm 
                       text-emerald-700 cursor-pointer select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}


              <p className="text-sm text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-primary font-medium hover:underline"
                >
                  Forgot Password
                </Link>
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer"
              />
              <p>
                I agree to the{" "}
                <span
                  onClick={() => navigate("/terms-conditions")}
                  className="text-primary underline cursor-pointer font-semibold"
                >
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span
                  onClick={() => navigate("/privacy-policy")}
                  className="text-primary underline cursor-pointer font-semibold"
                >
                  Privacy Policy
                </span>.
              </p>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: isLoading || !acceptedTerms ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !acceptedTerms ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading || !acceptedTerms}
              className="w-full mt-4 h-12 bg-primary text-white rounded-lg 
  shadow flex items-center justify-center gap-3
  disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <ButtonLoader />}
              <span>{isLoading ? "Logging in..." : "Login"}</span>
            </motion.button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <p className="text-gray-500 text-sm">OR</p>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <div className="relative flex justify-center">

            {/* Disabled Overlay */}
            {!acceptedTerms && (
              <div
                className="absolute inset-0 z-10 bg-transparent cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  toast.error("Please accept Terms & Conditions to continue");
                }}
              ></div>
            )}
 
            {/* Google Button */}
            <div
              className={`${!acceptedTerms ? "opacity-50" : ""}`}
            >
              <GoogleLoginPatient redirectTo={redirectTo} />
            </div>

          </div>
          {/* Signup Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="text-primary font-semibold hover:underline"
            >
              Create Account
            </Link>

          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
