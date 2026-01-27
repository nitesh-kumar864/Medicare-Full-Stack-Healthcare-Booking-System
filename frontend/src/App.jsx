import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import { AppContext } from "./context/AppContext";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";

import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import HelpCenter from "./pages/HelpCenter";
import MySupport from "./pages/MySupport";
import FaqPage from "./pages/FaqPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import BedPage from "./pages/BedPage";
import MyBedBookings from "./pages/MyBedBookings";
import NotFound from "./pages/NotFound";

import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";


// Auth
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignUpPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { initialLoading } = useContext(AppContext);

  if (initialLoading) return <Loader />;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop
        pauseOnFocusLoss={false}
        limit={3}
      />

      <ScrollToTop />

      <Routes>
        {/* Layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/doctors/:speciality" element={<Doctor />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bed-bookings"
            element={
              <ProtectedRoute>
                <MyBedBookings />
              </ProtectedRoute>
            }
          />

          <Route path="/appointments/:docId" element={<Appointment />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/my-support" element={<MySupport />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/refund-policy" element={<RefundPolicy />} />

          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/bed-availability" element={<BedPage />} />

        </Route>

        {/* Auth pages  */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />


        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
