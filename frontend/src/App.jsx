import React, { useContext,useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import socket from "./socket";

import { AppContext } from "./context/AppContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./layouts/MainLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// Main pages
const Home = lazy(() => import("./pages/Home"));
const Doctor = lazy(() => import("./pages/Doctor"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Appointment = lazy(() => import("./pages/Appointment"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const MySupport = lazy(() => import("./pages/MySupport"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const BedPage = lazy(() => import("./pages/BedPage"));
const NotFound = lazy(() => import("./pages/NotFound"));


// Protected pages
const MyProfile = lazy(() => import("./pages/MyProfile"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const MyBedBookings = lazy(() => import("./pages/MyBedBookings"));
const ChatPage =  lazy(() => import("./pages/ChatPage"));

// Auth pages
const LoginPage = lazy(() => import("./auth/LoginPage"));
const SignUpPage = lazy(() => import("./auth/SignUpPage"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));



const App = () => {
  const { initialLoading, token } = useContext(AppContext);
useEffect(() => {
  if (!token) return;

  socket.auth = { token };
  socket.connect();

  socket.on("connect", () => {
    console.log("User socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User socket disconnected");
  });

  return () => {
    socket.disconnect();
  };
}, [token]);


  // App-level loader (token check, cold start)
  if (initialLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop
        pauseOnFocusLoss={false}
        limit={3}
      />

      <ScrollToTop />

      {/* Route-level loader */}
      <Suspense fallback={<Loader />}>
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

            <Route
              path="/my-support"
              element={
                <ProtectedRoute>
                  <MySupport/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:appointmentId"
              element={
                <ProtectedRoute>
                  <ChatPage/>
                </ProtectedRoute>
              }
            />

            <Route path="/appointments/:docId" element={<Appointment />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/bed-availability" element={<BedPage />} />


          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
