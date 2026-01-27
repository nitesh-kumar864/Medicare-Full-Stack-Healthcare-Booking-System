import { doctorListService } from "../../services/doctor/doctor.service.js";

// PUBLIC DOCTOR LIST (USER / ADMIN)
export const doctorList = async (req, res) => {
  try {
    const result = await doctorListService();
    return res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
