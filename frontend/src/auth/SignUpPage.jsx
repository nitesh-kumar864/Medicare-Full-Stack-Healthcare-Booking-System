import { motion } from "framer-motion";
import { Lock, Mail, User, AtSign,Eye,EyeOff } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Input from "../components/Input";
import GoogleLoginPatient from "../components/GoogleLoginPatient";
import FloatingShape from "../components/FloatingShape";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { ButtonLoader } from "../components/Loader";
import useUsernameAvailability from "../hooks/useUsernameAvailability";

const SignUpPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    username,
    usernameStatus,
    isUsernameValid,
    checkingUsername,
    checkUsernameAvailability,
  } = useUsernameAvailability({
    backendUrl,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  // VALIDATION ERROR STATE
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateFields = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.includes(" ")) {
      newErrors.password = "Password must not contain spaces";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleEmailContinue = () => {
    if (!email.trim()) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return;
    }

    setErrors({ ...errors, email: "" });
    setStep(2);
  };


  // SIGNUP FUNCTION
  const handleSignUp = async (e) => {
    e.preventDefault();

    const scrollTopMobile = () => {
      if (window.innerWidth <= 640) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (!acceptedTerms) {
      scrollTopMobile();
      toast.error("Please accept Terms & Conditions to continue");
      return;
    }

    if (!validateFields()) {
      scrollTopMobile();
      return;
    }

    if (!isUsernameValid) {
      scrollTopMobile();
      toast.error("Please choose a valid username");
      return;
    }

    setIsLoading(true);

    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/signup/send-otp",
        { name, username, email, password }
      );

      if (data.success) {
        toast.success("OTP sent to your email");

        navigate("/verify-otp", {
          state: {
            name,
            username,
            email,
            password,
            from: redirectTo,
          },
        });
      } else {
        scrollTopMobile();
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      scrollTopMobile();
      toast.error(
        err.response?.data?.message || err.message || "OTP send failed"
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="pt-24 flex justify-center">
      <div className="relative w-full max-w-md">
        <FloatingShape color="bg-primary/40" size="w-40 h-40" top="-10%" left="-10%" delay={0} />
        <FloatingShape color="bg-primary/30" size="w-32 h-32" top="60%" left="-5%" delay={5} />
        <FloatingShape color="bg-primary/20" size="w-32 h-32" top="10%" left="70%" delay={10} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-xl border p-8"
        >
          {step === 1 ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                Create Account
              </h2>

              <form>
                {/* EMAIL FIELD */}
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  error={errors.email}
                  onChange={(e) => {
                    setErrors({ ...errors, email: "" });
                    setEmail(e.target.value.toLowerCase());
                  }}
                />

                {/* TERMS CHECKBOX */}
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 cursor-pointer"
                    id="terms-checkbox"
                  />
                  <label htmlFor="terms-checkbox" className="cursor-pointer">
                    I agree to the{" "}
                    <span
                      onClick={() => navigate("/terms-conditions")}
                      className="text-primary font-semibold cursor-pointer underline"
                    >
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span
                      onClick={() => navigate("/privacy-policy")}
                      className="text-primary font-semibold cursor-pointer underline"
                    >
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleEmailContinue}
                  disabled={!acceptedTerms}
                  className={`w-full h-12 mt-4 font-bold rounded-lg flex items-center justify-center gap-2
                    ${acceptedTerms
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  Continue with Email →
                </button>
              </form>
            </>
          ) : (
            // next page 
            <form onSubmit={handleSignUp}>
              <h2 className="text-3xl font-bold mb-4 text-center text-primary">
                Complete your account
              </h2>

              {/* NAME */}
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                error={errors.name}
                onChange={(e) => {
                  const input = e.target.value;
                  setErrors({ ...errors, name: "" });
                  const formatted = input
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join(" ");
                  setName(formatted);
                }}
              />

              <div className="mb-3">
                <Input
                  icon={AtSign}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => checkUsernameAvailability(e.target.value)}
                />

                {checkingUsername && (
                  <p className="text-xs text-gray-400">Checking availability…</p>
                )}
                {usernameStatus && (
                  <p
                    className={`text-xs ${isUsernameValid ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {usernameStatus}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <div
                  className={`relative flex items-center border rounded-xl overflow-hidden
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                >
                  <div className="absolute left-3">
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
                    className="w-full bg-white py-3 pl-10 pr-12 text-gray-800 placeholder-gray-500 outline-none"
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-emerald-700 cursor-pointer select-none"
                  >
                     {showPassword ? <EyeOff size={20 } /> : < Eye size={20} />}
                  </span>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}

                {<PasswordStrengthMeter password={password} />}
              </div>

              {/* SUBMIT */}
              <motion.button
                className="mt-5 w-full h-12 bg-primary text-white font-bold 
                  rounded-lg shadow-lg hover:bg-primary/90 transition duration-200
                  flex items-center justify-center gap-3
                  disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading || !acceptedTerms ? 1 : 1.02 }}
                whileTap={{ scale: isLoading || !acceptedTerms ? 1 : 0.98 }}
                type="submit"
                disabled={!acceptedTerms || isLoading || !isUsernameValid}

              >
                {isLoading && <ButtonLoader />}
                <span>{isLoading ? "Creating account..." : "Sign Up"}</span>
              </motion.button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="block mx-auto mt-4 text-xs text-gray-500 underline hover:text-gray-700"
              >
                ← Back
              </button>
            </form>
          )}

          {/* Divider*/}
          {step === 1 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                <p className="text-gray-500 text-sm">OR</p>
                <div className="flex-1 h-[1px] bg-gray-300"></div>
              </div>

              {/* Google Login */}
              <div className="relative flex justify-center">
                {!acceptedTerms && (
                  <div
                    className="absolute inset-0 z-10 bg-transparent cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.error("Please accept Terms & Conditions to continue");
                    }}
                  ></div>
                )}

                <div className={`${!acceptedTerms ? "opacity-50" : ""}`}>
                  <GoogleLoginPatient redirectTo={redirectTo} />
                </div>
              </div>
            </>
          )}

          {/* LOGIN */}
          <div className="px-2 py-4 flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from: redirectTo }}
                className="text-primary font-semibold hover:underline"
              >
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;