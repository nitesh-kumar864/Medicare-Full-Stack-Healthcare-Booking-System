import {
  appointmentDoctorService,
  appointmentCompleteService,
  appointmentCancelService,
} from "../../services/doctor/appointment.service.js";

// GET APPOINTMENTS
export const appointmentDoctor = async (req, res) => {
  try {
    const result = await appointmentDoctorService(req.doctorId);
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// COMPLETE APPOINTMENT
export const appointmentComplete = async (req, res) => {
  try {
    const result = await appointmentCompleteService(
      req.doctorId,
      req.body.appointmentId
    );
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// CANCEL APPOINTMENT
export const appointmentCancel = async (req, res) => {
  try {
    const result = await appointmentCancelService(
      req.doctorId,
      req.body.appointmentId
    );
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
