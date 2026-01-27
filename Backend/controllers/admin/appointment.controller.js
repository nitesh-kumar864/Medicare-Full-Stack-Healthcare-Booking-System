import {
  appointmentsAdminService,
  appointmentCancelService,
} from "../../services/admin/appointment.service.js";

// ================= GET ALL APPOINTMENTS (ADMIN) =================
export const appointmentsAdmin = async (req, res) => {
  try {
    const result = await appointmentsAdminService();
    return res.json(result);
  } catch (error) {
    console.error("Admin appointments error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CANCEL APPOINTMENT (ADMIN) =================
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const result = await appointmentCancelService(appointmentId);
    return res.json(result);
  } catch (error) {
    console.error("Admin cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
