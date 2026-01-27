import Bed from "../../models/bedModel.js";
import Booking from "../../models/BookingModel.js";

/* ======================  GET ALL BED BOOKINGS  ====================== */
export const getAllBedBookingsAdminService = async () => {
  try {
    return await Booking.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

/* ======================  UPDATE BED CONFIG  ====================== */
export const updateBedConfigAdminService = async (body) => {
  try {
    const { totalBeds, generalTotal, icuTotal, emergencyTotal } = body;

    const bed = await Bed.findOne();
    if (!bed) {
      throw new Error("Bed data not found");
    }

    if (totalBeds !== undefined) bed.totalBeds = totalBeds;
    if (generalTotal !== undefined)
      bed.bedTypes.general.total = generalTotal;
    if (icuTotal !== undefined) bed.bedTypes.icu.total = icuTotal;
    if (emergencyTotal !== undefined)
      bed.bedTypes.emergency.total = emergencyTotal;

    await bed.save();
    return bed;
  } catch (error) {
    throw error;
  }
};

/* ======================  RESET ALL BEDS  ====================== */
export const resetBedsAdminService = async () => {
  try {
    const bed = await Bed.findOne();
    if (!bed) {
      throw new Error("Bed data not found");
    }

    bed.occupiedBeds = 0;
    bed.bedTypes.general.occupied = 0;
    bed.bedTypes.icu.occupied = 0;
    bed.bedTypes.emergency.occupied = 0;

    // Clear all occupied bed numbers
    bed.occupiedNumbers = [];

    await bed.save();

    // Update all bookings
    await Booking.updateMany(
      { status: "booked" },
      { $set: { status: "cancelled" } }
    );
  } catch (error) {
    throw error;
  }
};

/* ======================  CANCEL BOOKING  ====================== */
export const cancelBookingAdminService = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }

    const prevStatus = booking.status;
    booking.status = "cancelled";
    await booking.save();

    // Only decrement if it was previously occupied
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

/* ======================  RESET INDIVIDUAL BED  ====================== */
export const resetIndividualBedAdminService = async (bedNumber) => {
  try {
    const bed = await Bed.findOne();
    if (!bed) {
      throw new Error("Bed data not found");
    }

      const bedNum = Number(bedNumber);


    if (!bed.occupiedNumbers.includes(Number(bedNumber))) {
      throw new Error("Bed is already available");
    }

    const booking = await Booking.findOne({
      bedNumber: Number(bedNumber),
      status: { $in: ["booked", "paid"] },
    });

    if (booking) {
      booking.status = "cancelled";
      await booking.save();
    }

    // detect bed type
    const detectBedType = (num) => {
      if (num >= 101 && num <= 200) return "general";
      if (num >= 201 && num <= 220) return "icu";
      if (num >= 301 && num <= 320) return "emergency";
      return null;
    };

    const type = detectBedType(Number(bedNumber));

    await Bed.findOneAndUpdate(
      {},
      {
        $inc: {
          occupiedBeds: -1,
          [`bedTypes.${type}.occupied`]: -1,
        },
        $pull: { occupiedNumbers: Number(bedNumber) },
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
