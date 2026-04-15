import express from "express";

// ---------- AUTH CONTROLLERS ----------
import {
  signup,
  verifySignupOtp,
  loginUser,
  googlePatientLogin,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/user/auth.controller.js";

// ---------- PROFILE CONTROLLERS ----------
import {
  getProfile,
  updateProfile,
  checkUsername,
  changeUsername,
} from "../controllers/user/profile.controller.js";

// ---------- APPOINTMENT CONTROLLERS ----------
import {
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controllers/user/appointment.controller.js";

import { getBookingStatus } from "../controllers/bed/bed.controller.js";


import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// ---------- AUTH ROUTES ---------
userRouter.post("/signup/send-otp", signup);
userRouter.post("/signup/verify-otp", verifySignupOtp);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googlePatientLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.get("/check-auth", authUser, checkAuth);

// ---------- USERNAME ---------
userRouter.post("/check-username", checkUsername);
userRouter.post("/change-username", authUser, changeUsername);

// ---------- USER PROFILE ---------
userRouter.get("/my-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile
);

// ---------- APPOINTMENTS ---------
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// ----- bed booking ---------
userRouter.get("/booking-status", authUser, getBookingStatus);

export default userRouter;
 