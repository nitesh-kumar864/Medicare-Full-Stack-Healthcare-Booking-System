import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleLoginPatient = ({ redirectTo }) => {
  const { backendUrl, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleResponse = async (response) => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/google-login`, {
        credential: response.credential,
      });

      if (res.data.success) {
        toast.success("Google Login Successful!");

        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUserData(res.data.userData);

        // 1) Direct param from Login/Signup page
        let finalRedirect =
          redirectTo ||
          localStorage.getItem("redirect_after_google") ||
          location.state?.from ||
          "/";

        // 2) Clear storage
        localStorage.removeItem("redirect_after_google");

        navigate(finalRedirect, { replace: true });
      }
    } catch (err) {
      toast.error("Google Login Failed");
      console.log(err);
    }
  };

  useEffect(() => {
    /* global google */
    if (!window.google) return;

    // Save temporary redirect if provided
    if (redirectTo) {
      localStorage.setItem("redirect_after_google", redirectTo);
    }

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("gLoginBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }, [redirectTo]);

  return (
    <div id="gLoginBtn" className="w-full flex justify-center"></div>
  );
};

export default GoogleLoginPatient;
