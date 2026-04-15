import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock,Eye,EyeOff } from "lucide-react"; // icons

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          backendUrl + "/api/admin/login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin Login Successful!");
          navigate("/admin/dashboard");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/doctor/login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor Login Successful!");
          navigate("/doctor/dashboard");
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
      >

        {/* HEADER */}
        <h2 className="text-4xl font-bold text-center text-primary mb-3">
          {state === "Admin" ? "Admin Login" : "Doctor Login"}
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Access your secure Medicare dashboard
        </p>

        {/* EMAIL INPUT */}
        <div className="relative mb-6">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 size-5" />
          <input
            type="email"
            className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-3 text-gray-800 placeholder-gray-500 shadow-sm focus:ring-emerald-500/40 focus:border-emerald-600 transition"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD INPUT */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 size-5" />
          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-3 text-gray-800 placeholder-gray-500 shadow-sm focus:ring-emerald-500/40 focus:border-emerald-600 transition"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700 cursor-pointer text-sm"
          >
             {showPassword ? <EyeOff size={20 } /> : < Eye size={20} />}
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary text-white rounded-xl text-lg font-semibold 
  shadow-lg hover:bg-primary/90 transition-all
  flex items-center justify-center gap-3
  disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          <span>{isLoading ? "Logging in..." : "Login"}</span>
        </button>


        {/* SWITCH */}
        <p className="text-center mt-6 text-gray-700 text-sm">
          {state === "Admin" ? (
            <>
              Doctor Login?{" "}
              <span
                className="text-primary font-semibold cursor-pointer hover:underline"
                onClick={() => setState("Doctor")}
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{" "}
              <span
                className="text-primary font-semibold cursor-pointer hover:underline"
                onClick={() => setState("Admin")}
              >
                Click here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
