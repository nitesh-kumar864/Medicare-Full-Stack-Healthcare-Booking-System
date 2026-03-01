import appointmentModel from "../models/appointmentModel.js";
import { generatePrescriptionPDF } from "../services/prescriptionPdf.Service.js";

export const downloadPrescription = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (!appointment.userId.equals(req.userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

if (!appointment.payment) {
  return res.status(400).json({
    success: false,
    message: "Prescription not available yet",
  });
}

    //Generate & Send PDF
    generatePrescriptionPDF(appointment, res);

  } catch (error) {
    console.error("Download Prescription Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};