import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "doctor"],
      required: true,
    },
    text: String,
    type: {
      type: String,
      enum: ["text", "image", "pdf"],
      default: "text",
    },
    fileUrl: {
      type: String,
      default: null,
    },

    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("message", messageSchema);
