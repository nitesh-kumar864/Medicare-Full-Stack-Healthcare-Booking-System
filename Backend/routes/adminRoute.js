import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";


//------------------ AUTH ------------------
import {
  loginAdmin,
  getAdminProfile,
} from "../controllers/admin/auth.controller.js";


//------------------ DOCTOR MANAGEMENT ------------------
import {
  addDoctor,
  allDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
} from "../controllers/admin/doctor.controller.js";

import{  changeAvailability } from "../controllers/doctor/profile.controller.js";

//------------------ APPOINTMENTS------------------
import {
  appointmentsAdmin,
  appointmentCancel,
} from "../controllers/admin/appointment.controller.js";


//------------------ DASHBOARD ------------------
import {
  adminDashboard,
  getBedRevenue,
} from "../controllers/admin/dashboard.controller.js";


const adminRouter = express.Router();

//------------------ AUTH ROUTES ------------------
adminRouter.post("/login", loginAdmin);
adminRouter.get("/profile", authAdmin, getAdminProfile);


//------------------ DOCTOR ROUTES------------------

// add doctor
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.single("image"),
  addDoctor
);

// list doctors
adminRouter.get(
"/doctors",
  authAdmin,
  allDoctors
);

// get doctor by id
adminRouter.get(
  "/doctor/:doctorId",
  authAdmin,
  getDoctorById
);

// update doctor
adminRouter.patch(
  "/doctor/:doctorId",
  authAdmin,
  upload.single("image"),
  updateDoctorById
);

// delete doctor
adminRouter.delete(
  "/doctor/:doctorId",
  authAdmin,
  deleteDoctorById
);

// admin changes doctor availability
adminRouter.post(
  "/doctor/:doctorId/change-availability",
  authAdmin,
  changeAvailability
);


//------------------ APPOINTMENT ROUTES ------------------
adminRouter.get(
  "/appointments",
  authAdmin,
  appointmentsAdmin
);

adminRouter.post(
  "/appointments/cancel",
  authAdmin,
  appointmentCancel
);


//------------------ DASHBOARD ROUTES ------------------
adminRouter.get(
  "/dashboard",
  authAdmin,
  adminDashboard
);

adminRouter.get(
  "/bed-revenue",
  authAdmin,
  getBedRevenue
);

export default adminRouter;
