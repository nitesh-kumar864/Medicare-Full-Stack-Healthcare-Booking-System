import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [adminData, setAdminData] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAdminPageLoading, setIsAdminPageLoading] = useState(false);

  const isLoggingOutRef = useRef(false);

  //  --------------------------- AXIOS GLOBAL CONFIG ----------------------------------
 
  useEffect(() => {
    axios.defaults.withCredentials = true;

    if (aToken) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${aToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [aToken]);

    //  ---------------------------   LOGOUT ---------------------------
  const logoutAdmin = (showToast = true) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (showToast) toast.success("Admin logged out");

    localStorage.removeItem("aToken");
    setAToken("");
    setAdminData(null);

    delete axios.defaults.headers.common["Authorization"];

    window.location.replace("/"); 
  };


    //  ---------------------------  AXIOS RESPONSE INTERCEPTOR --------------------------- 

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          localStorage.getItem("aToken") &&
          !isLoggingOutRef.current
        ) {
          logoutAdmin(false);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);


    //  --------------------------- LOAD ADMIN PROFILE  ---------------------------

  const loadAdminData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/profile"
      );

      if (data.success) {
        setAdminData(data.adminData);
      } else {
        logoutAdmin(false);
      }
    } catch {
      logoutAdmin(false);
    }
  };


    //  ---------------------------  INITIAL AUTH CHECK    ---------------------------

  useEffect(() => {
    setIsAdminLoading(true);

    if (aToken) {
      loadAdminData().finally(() => setIsAdminLoading(false));
    } else {
      setAdminData(null);
      setIsAdminLoading(false);
    }
  }, [aToken]);


     //  --------------------------- API FUNCTIONS  ---------------------------


  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/doctors"
      );
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const changeAvailability = async (doctorId) => {
    try {
      const { data } = await axios.post(
        backendUrl + `/api/admin/doctors/${doctorId}/change-availability`
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/appointments"
      );
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/appointments/cancel",
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/dashboard"
      );
      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

 
    //  ---------------------------  PROVIDER  ---------------------------
  
  return (
    <AdminContext.Provider
      value={{
        aToken,
        setAToken,
        logoutAdmin,

        backendUrl,
        adminData,

        doctors,
        getAllDoctors,
        changeAvailability,

        appointments,
        getAllAppointments,
        cancelAppointment,

        dashData,
        getDashData,

        isAdminLoading,
        setIsAdminLoading,
        isAdminPageLoading,
        setIsAdminPageLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
