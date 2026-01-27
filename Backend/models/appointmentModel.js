import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      required: true
    },

    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },

    userData: { type: Object, required: true },
    doctorData: { type: Object, required: true },

    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["pending", "booked", "completed", "cancelled"],
      default: "pending",
    },
    
    payment: {
      type: Boolean,
      default: false,
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cash", "none"],
      default: "none"
    },

    transactionId: {
      type: String,
      default: "",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    cancelled: {
      type: Boolean,
      default: false,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { userId: 1, docId: 1, slotDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      payment: false,
      cancelled: false
    }
  }
);

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
