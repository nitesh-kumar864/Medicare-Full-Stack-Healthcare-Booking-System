import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../../models/doctorModel.js";

// ================= DOCTOR LOGIN =================
export const loginDoctorService = async ({ email, password }) => {
  // Validation
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }


  const doctor = await doctorModel.findOne({ email });
  if (!doctor) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Generate JWT
  const token = jwt.sign(
    { id: doctor._id, role: "doctor" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    success: true,
    message: "Doctor logged in successfully",
    token,
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      image: doctor.image,
    },
  };
};
