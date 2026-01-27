import {
  loginAdminService,
  getAdminProfileService,
} from "../../services/admin/auth.service.js";

// ================= ADMIN LOGIN =================
export const loginAdmin = async (req, res) => {
  try {
    const result = await loginAdminService(req.body);
    return res.json(result);
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ADMIN PROFILE =================
export const getAdminProfile = async (req, res) => {
  try {
    const result = await getAdminProfileService();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
