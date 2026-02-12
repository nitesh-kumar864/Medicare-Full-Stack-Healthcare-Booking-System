import React, { useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import socket from "./socket";

import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointment from "./pages/Admin/AllAppointment";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

import SupportQueries from "./pages/Admin/SupportQueries";
import BedBooking from "./pages/Admin/BedBooking";
import BedManager from "./pages/Admin/BedManager";

import DoctorDetails from "./pages/Admin/DoctorDetails";
import EditDoctor from "./pages/Admin/EditDoctor";
import DoctorChatPage from "./pages/Doctor/DoctorChatPage";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Loader from "./components/Loader";

// NEW LAYOUTS
import AdminLayout from "./layout/AdminLayout";
import DoctorLayout from "./layout/DoctorLayout";

const App = () => {
  const { aToken, isAdminLoading, isAdminPageLoading } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  // Auto redirect
  useEffect(() => {
    if (window.location.pathname === "/") {
      if (aToken) navigate("/admin/dashboard");
      else if (dToken) navigate("/doctor/dashboard");
    }
  }, [aToken, dToken, navigate]);


  useEffect(() => {
    if (!dToken) return;

    socket.auth = { dtoken: dToken };

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Doctor socket connected:", socket.id);
    };

    const onDisconnect = (reason) => {
      console.log("Doctor socket disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [dToken]);



  // Loader before showing layout
  if (isAdminLoading || isAdminPageLoading) {
    return (
      <div className="bg-[#F8F9FD]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FD]">

      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop={true}
        pauseOnFocusLoss={false}
        limit={3}
      />

      {/* If NOT logged in → show login */}
      {!aToken && !dToken ? (
        <Login />
      ) : (
        <Routes>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="all-appointments" element={<AllAppointment />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="doctors-list" element={<DoctorsList />} />
            <Route path="support-queries" element={<SupportQueries />} />
            <Route path="beds" element={<BedManager />} />
            <Route path="bed-bookings" element={<BedBooking />} />
            <Route path="doctor/:doctorId" element={<DoctorDetails />} />
            <Route path="edit-doctor/:doctorId" element={<EditDoctor />} />
          </Route>


          {/* DOCTOR ROUTES */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointment />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="/doctor/chat/:appointmentId" element={<DoctorChatPage />} />


          </Route>

        </Routes>
      )}
    </div>
  );
};

export default App;
