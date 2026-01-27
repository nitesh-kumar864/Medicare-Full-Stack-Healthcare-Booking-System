import Bed from "../../models/bedModel.js";
import Booking from "../../models/BookingModel.js";

/* =================  GET BED AVAILABILITY (USER + ADMIN) ================= */
export const getAvailabilityService = async () => {
  try {
    // delete expired locked bookings
    await Booking.deleteMany({
      status: "locked",
      payment: false,
      lockExpiresAt: { $lt: new Date() },
    });

    const bed = await Bed.findOne();
    if (!bed) {
      throw new Error("Bed data not found.");
    }

    // locked beds
    const lockedBookings = await Booking.find({
      status: "locked",
      lockExpiresAt: { $gt: Date.now() },
    }).select("bedNumber");

    const lockedNumbers = lockedBookings.map((b) => b.bedNumber);

    return {
      bedRanges: bed.bedRanges,
      totalBeds: bed.totalBeds,
      occupiedBeds: bed.occupiedBeds,
      occupiedNumbers: bed.occupiedNumbers,
      lockedNumbers,
      availableBeds: bed.availableBeds,
      bedTypes: bed.bedTypes,
      availableBedTypes: bed.availableBedTypes,
    };
  } catch (error) {
    console.log("Availability Error:", error);
    throw error;
  }
};

/* ============================  BOOK BED (USER) ============================ */
export const bookBedService = async (userId, body) => {
  try {
    const { name, email, phone, purpose, bedNumber, price, bedType } = body;

    if (!name || !email || !phone || !purpose || !bedNumber || !price) {
      throw new Error("All fields are required");
    }

    const existingUserLock = await Booking.findOne({
      userId,
      status: "locked",
      payment: false,
      lockExpiresAt: { $gt: new Date() },
    });

    if (existingUserLock) {
      throw new Error("You already have a pending bed booking.");
    }

    // ATOMIC LOCK CHECK
    const existingLock = await Booking.findOne({
      bedNumber,
      status: { $in: ["locked", "booked"] },
      lockExpiresAt: { $gt: Date.now() },
    });

    if (existingLock) {
      throw new Error("Bed is currently locked or booked");
    }

    // Limit check
    const totalBookings = await Booking.countDocuments({
      userId,
      status: { $in: ["booked", "paid"] },
    });

    if (totalBookings >= 7) {
      throw new Error("Maximum 7 bed bookings allowed.");
    }

    // Auto detect type
    const detectBedType = (num) => {
      if (num >= 101 && num <= 200) return "general";
      if (num >= 201 && num <= 220) return "icu";
      if (num >= 301 && num <= 320) return "emergency";
      return null;
    };

    const finalBedType = bedType || detectBedType(bedNumber);
    if (!finalBedType) {
      throw new Error("Invalid bed category");
    }

    const bed = await Bed.findOne();

    const available =
      bed.bedTypes[finalBedType].total -
      bed.bedTypes[finalBedType].occupied;

    if (available <= 0) {
      throw new Error(`No beds available in ${finalBedType} ward`);
    }

    // Create booking (pending)
    const booking = await Booking.create({
      userId,
      name,
      email,
      phone,
      purpose,
      bedType: finalBedType,
      bedNumber,
      price,
      status: "locked",
      lockedBy: userId,
      lockExpiresAt: Date.now() + 3 * 60 * 1000,
      payment: false,
    });

    return booking;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* ========================  GET USER BOOKINGS ======================== */
export const getMyBookingsService = async (userId) => {
  try {
    return await Booking.find({ userId }).sort({ createdAt: -1 });
  } catch (err) {
    throw err;
  }
};

/* ========================  CANCEL BOOKING (USER) ======================== */
export const cancelBookingService = async (userId, bookingId) => {
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: { $in: ["locked", "pending", "booked", "paid"] },
    });

    if (!booking) {
      throw new Error("Booking not found or already cancelled");
    }

    const prevStatus = booking.status;

    booking.status = "cancelled";
    booking.lockedBy = null;
    booking.lockExpiresAt = null;
    await booking.save();

    if (prevStatus === "booked" || prevStatus === "paid") {
      const updateOps = {
        $inc: {
          occupiedBeds: -1,
          [`bedTypes.${booking.bedType}.occupied`]: -1,
        },
        $pull: { occupiedNumbers: booking.bedNumber },
      };

      const bed = await Bed.findOneAndUpdate({}, updateOps, { new: true });

      if (bed) {
        if (bed.occupiedBeds < 0) bed.occupiedBeds = 0;
        if (
          bed.bedTypes &&
          bed.bedTypes[booking.bedType] &&
          bed.bedTypes[booking.bedType].occupied < 0
        ) {
          bed.bedTypes[booking.bedType].occupied = 0;
        }
        await bed.save();
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* ======================  GET BOOKING STATUS (USER) ====================== */
export const getBookingStatusService = async (userId) => {
  try {
    return await Booking.findOne({
      userId,
      status: "booked",
    });
  } catch (error) {
    throw error;
  }
};
