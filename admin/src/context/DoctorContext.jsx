import axios from "axios";
import { useState, createContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [isDoctorLoading, setIsDoctorLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isLoggingOutRef = useRef(false);

  // AXIOS GLOBAL CONFIG
  useEffect(() => {
    axios.defaults.withCredentials = true;

    if (dToken) {
      axios.defaults.headers.common["dtoken"] = dToken;
    } else {
      delete axios.defaults.headers.common["dtoken"];
    }
  }, [dToken]);

  //  LOGOUT DOCTOR (LOOP SAFE)
  const logoutDoctor = (showToast = true) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (showToast) {
      toast.info("Session expired. Please login again.");
    }

    localStorage.removeItem("dToken");
    setDToken("");
    setProfileData(null);

    delete axios.defaults.headers.common["dtoken"];

    window.location.replace("/doctor/login");
  };

  // AXIOS RESPONSE INTERCEPTOR
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          localStorage.getItem("dToken")
        ) {
          logoutDoctor(false);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // API FUNCTIONS
  const getAppointments = async () => {
    setIsPageLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments"
      );
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    setIsActionLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/appointment/complete",
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else toast.error(data.message);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setIsActionLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/appointment/cancel",
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else toast.error(data.message);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const getDashData = async () => {
    setIsPageLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/dashboard"
      );
      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  const getProfileData = async () => {
    setIsPageLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/profile"
      );
      if (data.success) setProfileData(data.profileData);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  // INITIAL AUTH CHECK
  useEffect(() => {
    setIsDoctorLoading(true);

    if (dToken) {
      getProfileData().finally(() => setIsDoctorLoading(false));
    } else {
      setProfileData(null);
      setIsDoctorLoading(false);
    }
  }, [dToken]);

  return (
    <DoctorContext.Provider
      value={{
        dToken,
        setDToken,
        logoutDoctor,
        backendUrl,

        appointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,

        dashData,
        getDashData,

        profileData,
        setProfileData,
        getProfileData,

        isDoctorLoading,
        isPageLoading,
        isActionLoading,
      }}
    >
      {children}
    </DoctorContext.Provider>

  );
};

export default DoctorContextProvider;
