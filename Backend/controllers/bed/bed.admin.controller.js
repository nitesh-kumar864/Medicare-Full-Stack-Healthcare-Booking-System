import {
  getAllBedBookingsAdminService,
  updateBedConfigAdminService,
  resetBedsAdminService,
  cancelBookingAdminService,
  resetIndividualBedAdminService,
} from "../../services/bed/bed.admin.service.js";

/* ----------------------GET ALL BED BOOKINGS (ADMIN)------------------ */
export const getAllBedBookingsAdmin = async (req, res) => {
  try {
    const bookings = await getAllBedBookingsAdminService();

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ----------------------UPDATE BED CONFIG (ADMIN)--------------------------- */
export const updateBedConfigAdmin = async (req, res) => {
  try {
    const bed = await updateBedConfigAdminService(req.body);

    res.json({
      success: true,
      message: "Bed configuration updated",
      bed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Update failed",
    });
  }
};


 /* ---------------------- RESET ALL BEDS (ADMIN) ---------------------- */
export const resetBedsAdmin = async (req, res) => {
  try {
    await resetBedsAdminService();

    res.json({
      success: true,
      message: "All beds reset successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


   /* ---------------------- CANCEL BOOKING (ADMIN) ---------------------- */
export const cancelBookingAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await cancelBookingAdminService(bookingId);

    res.json({
      success: true,
      message: "Booking cancelled by admin",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cancel failed",
    });
  }
};

    /*  ----------------------RESET INDIVIDUAL BED (ADMIN) ---------------------- */
export const resetIndividualBedAdmin = async (req, res) => {
  try {
    const { bedNumber } = req.params;

    await resetIndividualBedAdminService(bedNumber);

    res.json({
      success: true,
      message: `Bed ${bedNumber} reset successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
