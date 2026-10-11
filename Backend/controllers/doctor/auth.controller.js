import { loginDoctorService } from "../../services/doctor/auth.service.js";
import { forgotDoctorPasswordService, resetDoctorPasswordService } from "../../services/doctor/auth.service.js";


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


// ================= FORGOT DOCTOR PASSWORD =================
export const forgotDoctorPassword = async (req, res) => {
  try {
    const result = await forgotDoctorPasswordService(req.body);

    return res.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Forgot doctor password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process recovery request",
    });
  }
};


export const resetDoctorPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await resetDoctorPasswordService(
      token,
      password
    );

    return res.json(result);

  } catch (error) {
    console.error("Reset doctor password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};
