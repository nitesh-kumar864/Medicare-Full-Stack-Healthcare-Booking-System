import doctorModel from "../../models/doctorModel.js";

// ================= GET DOCTOR PROFILE =================
export const doctorProfileService = async (doctorId) => {
  const doctor = await doctorModel
    .findById(doctorId)
    .select("-password");

  if (!doctor) {
    return {
      success: false,
      message: "Doctor not found",
    };
  }

  return {
    success: true,
    profileData: doctor,
  };
};

// ================= UPDATE DOCTOR PROFILE =================
export const updateDoctorProfileService = async (doctorId, data) => {
  const { fees, address, available } = data;

  await doctorModel.findByIdAndUpdate(
    doctorId,
    {
      fees,
      address,
      available,
    },
    { new: true }
  );

  return {
    success: true,
    message: "Profile updated successfully",
  };
};

// ================= CHANGE AVAILABILITY (DOCTOR + ADMIN) =================
export const changeAvailabilityService = async (doctorId) => {
  const doctor = await doctorModel.findById(doctorId);

  if (!doctor) {
    return {
      success: false,
      message: "Doctor not found",
    };
  }

  doctor.available = !doctor.available;
  await doctor.save();

  return {
    success: true,
    message: "Availability changed successfully",
    available: doctor.available,
  };
};
