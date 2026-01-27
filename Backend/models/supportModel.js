import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
    name: String,
    email: String,
    subject: String,
    message: String,

    adminReply: { type: String, default: "" },
    status: { type: String, default: "open" }, // open / answered / closed
  },
  { timestamps: true }
);

const supportModel = mongoose.model("support", supportSchema);
export default supportModel;
