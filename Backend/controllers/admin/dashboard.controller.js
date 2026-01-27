import {
  adminDashboardService,
  getBedRevenueService,
} from "../../services/admin/dashboard.service.js";

// ================= ADMIN DASHBOARD DATA =================
export const adminDashboard = async (req, res) => {
  try {
    const result = await adminDashboardService();
    return res.json(result);
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= BED REVENUE =================
export const getBedRevenue = async (req, res) => {
  try {
    const result = await getBedRevenueService();
    return res.json(result);
  } catch (error) {
    console.error("Bed revenue error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate bed revenue",
    });
  }
};
