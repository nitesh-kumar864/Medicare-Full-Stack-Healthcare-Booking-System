import express from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

// USER 
import {
  getAvailability,
  bookBed,
  cancelBooking,
  getMyBookings,
  getBookingStatus,
} from "../controllers/bed/bed.controller.js";

// ADMIN CONTROLLERS
import {
  getAllBedBookingsAdmin,
  updateBedConfigAdmin,
  resetBedsAdmin,
  cancelBookingAdmin,
  resetIndividualBedAdmin,
} from "../controllers/bed/bed.admin.controller.js";

const router = express.Router();

/* ===================== USER ===================== */


router.get("/availability", getAvailability);
router.post("/book", authUser, bookBed);
router.post("/cancel/:bookingId", authUser, cancelBooking);
router.get("/my-bookings", authUser, getMyBookings);
router.get("/status", authUser, getBookingStatus);

/* ===================== ADMIN ROUTES ===================== */
router.get("/admin/bookings", authAdmin, getAllBedBookingsAdmin);
router.patch("/admin/update-config", authAdmin, updateBedConfigAdmin);
router.post("/admin/reset", authAdmin, resetBedsAdmin);
router.post("/admin/cancel/:bookingId", authAdmin, cancelBookingAdmin);
router.put("/admin/reset-individual/:bedNumber", authAdmin, resetIndividualBedAdmin);

export default router;
