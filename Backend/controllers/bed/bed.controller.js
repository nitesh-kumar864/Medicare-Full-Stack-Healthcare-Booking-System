import {
    getAvailabilityService,
    bookBedService,
    getMyBookingsService,
    cancelBookingService,
    getBookingStatusService,
} from "../../services/bed/bed.service.js";


/* =================  GET BED AVAILABILITY (USER + ADMIN ================= */
export const getAvailability = async (req, res) => {
    try {
        const data = await getAvailabilityService();

        res.json({
            success: true,
            ...data,
        });
    } catch (error) {
        console.log("Availability Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


/* =================  BOOK BED (USER)================= */
export const bookBed = async (req, res) => {
    try {
        const userId = req.userId;
        const booking = await bookBedService(userId, req.body);

        res.json({
            success: true,
            message: "Bed locked for 3 minutes.",
            booking,
        });
    } catch (error) {
        console.log("Book Bed Error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Booking failed",
        });
    }
};


/* =================  GET USER BOOKINGS================= */
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await getMyBookingsService(req.userId);

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
        });
    }
};


/* ================= CANCEL BOOKING (USER)================= */
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        await cancelBookingService(req.userId, bookingId);

        res.json({
            success: true,
            message: "Booking cancelled successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || "Cancel failed",
        });
    }
};


/* =================GET BOOKING STATUS (USER) ================= */
export const getBookingStatus = async (req, res) => {
    try {
        const booking = await getBookingStatusService(req.userId);

        res.json({
            success: true,
            activeBooking: booking ? true : false,
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
