import {
  doctorProfileService,
  updateDoctorProfileService,
  changeAvailabilityService,
} from "../../services/doctor/profile.service.js";

// GET DOCTOR PROFILE
export const doctorProfile = async (req, res) => {
  try {
    const result = await doctorProfileService(req.doctorId);
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// UPDATE DOCTOR PROFILE
export const updateDoctorProfile = async (req, res) => {
  try {
    const result = await updateDoctorProfileService(
      req.doctorId,
      req.body
    );
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// CHANGE AVAILABILITY 
export const changeAvailability = async (req, res) => {
  try {
    const result = await changeAvailabilityService(req.doctorId);
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
