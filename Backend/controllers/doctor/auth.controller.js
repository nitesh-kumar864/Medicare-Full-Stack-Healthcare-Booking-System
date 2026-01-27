import { loginDoctorService } from "../../services/doctor/auth.service.js";

export const loginDoctor = async (req, res) => {
  try {
    const result = await loginDoctorService(req.body);
    return res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
