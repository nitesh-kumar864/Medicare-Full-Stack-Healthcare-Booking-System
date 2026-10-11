import express from "express";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

//-------------------- login ------------------- 
import { 
  loginDoctor, 
  resetDoctorPassword, 
  forgotDoctorPassword 
} from "../controllers/doctor/auth.controller.js";

//-------------------- PROFILE ------------------- 
import {
  doctorProfile,
  updateDoctorProfile,
  changeAvailability,
} from "../controllers/doctor/profile.controller.js";

//--------------------  APPOINTMENTS ------------------- 
import {
  appointmentDoctor,
  appointmentComplete,
  appointmentCancel,
} from "../controllers/doctor/appointment.controller.js";

//--------------------  DASHBOARD------------------- 
import { doctorDashboard } from "../controllers/doctor/dashboard.controller.js";

//--------------------  PUBLIC ------------------- 
import { doctorList } from "../controllers/doctor/doctor.controller.js";



// PUBLIC
doctorRouter.get("/list", doctorList);

// AUTH
doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/forgot-password", forgotDoctorPassword);
doctorRouter.post("/reset-password/:token", resetDoctorPassword);

// PROFILE
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/change-availability", authDoctor, changeAvailability);

// APPOINTMENTS
doctorRouter.get("/appointments", authDoctor, appointmentDoctor);
doctorRouter.post("/appointment/complete", authDoctor, appointmentComplete);
doctorRouter.post("/appointment/cancel", authDoctor, appointmentCancel);

// DASHBOARD
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

export default doctorRouter;
