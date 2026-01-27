import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    bedType: {
      type: String,
      enum: ["general", "icu", "emergency"],
      required: true,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    bedNumber: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    payment: {
      type: Boolean,
      default: false,
    },

    /* ---------------- LOCK SYSTEM  ---------------- */
    status: {
      type: String,
      enum: ["locked", "booked", "cancelled"],
      default: "locked",
    },

    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lockExpiresAt: {
      type: Date,
    },

    cancelled: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
      default: "",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default Booking;
