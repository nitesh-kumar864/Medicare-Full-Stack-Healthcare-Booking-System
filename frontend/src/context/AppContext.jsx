import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currencySymbol = "₹";

  // ---------------- STATES ----------------
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

  // ---------------- HELPERS ----------------
  const getValidToken = () => {
    const t = localStorage.getItem("token");
    if (!t || t === "undefined" || t === "null") return null;
    return t;
  };

  // ---------------- API CALLS ----------------
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) setDoctors(data.doctors);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const loadUserProfileData = async (activeToken) => {
    if (!activeToken) {
      setUserData(null);
      return;
    }

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/my-profile`,
        { headers: { token: activeToken } }
      );

      if (data.success) {
        setUserData(data.userData);
      } else {
        logout(false);
      }
    } catch {
      logout(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = (showToast = true) => {
    if (showToast) toast.success("Logged out successfully");
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  };

  // ---------------- APP START ----------------
  useEffect(() => {
      const validToken = getValidToken();
      if (validToken) {
        setToken(validToken);
        loadUserProfileData(validToken);
      }
      setInitialLoading(false);
  }, []);

  // token change listener
  useEffect(() => {
    if (token) {
      loadUserProfileData(token);
    } else {
      setUserData(null);
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        currencySymbol,

        doctors,
        getDoctorsData,


        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        logout,

        initialLoading,
        globalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
