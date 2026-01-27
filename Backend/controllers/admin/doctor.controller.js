import {
  addDoctorService,
  allDoctorsService,
  getDoctorByIdService,
  updateDoctorByIdService,
  deleteDoctorByIdService,
} from "../../services/admin/doctor.service.js";

// ================= ADD DOCTOR =================
export const addDoctor = async (req, res) => {
  try {
    const result = await addDoctorService(req.body, req.file);
    return res.json(result);
  } catch (error) {
    console.error("Add doctor error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL DOCTORS  =================
export const allDoctors = async (req, res) => {
  try {
    const result = await allDoctorsService();
    return res.json(result);
  } catch (error) {
    console.error("Get doctors error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET DOCTOR BY ID =================
export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const result = await getDoctorByIdService(doctorId);
    return res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE DOCTOR BY ID =================
export const updateDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const result = await updateDoctorByIdService(
      doctorId,
      req.body,
      req.file
    );
    return res.json(result);
  } catch (error) {
    console.error("Update doctor error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE DOCTOR =================
export const deleteDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const result = await deleteDoctorByIdService(doctorId);
    return res.json(result);
  } catch (error) {
    console.error("Delete doctor error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
