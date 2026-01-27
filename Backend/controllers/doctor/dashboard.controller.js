import { doctorDashboardService } from "../../services/doctor/dashboard.service.js";

export const doctorDashboard = async (req, res) => {
  try {
    const result = await doctorDashboardService(req.doctorId);
    return res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
