import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import doctorModel from "../../models/doctorModel.js";



// ================= ADD DOCTOR =================
export const addDoctorService = async (data, file) => {
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  } = data;

  // ---- VALIDATION ----
  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !address
  ) {
    return { success: false, message: "Missing details" };
  }

  if (!validator.isEmail(email)) {
    return { success: false, message: "Please enter a valid email" };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  const existingDoctor = await doctorModel.findOne({ email });
  if (existingDoctor) {
    return {
      success: false,
      message: "Email already exists. Please use another email.",
    };
  }

  if (!file) {
    return {
      success: false,
      message: "Doctor image is required",
    };
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  // ---- UPLOAD IMAGE ----
  const uploadedImage = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });


  const doctorData = {
    name,
    email,
    password: hashedPassword,
    image: uploadedImage.secure_url,
    speciality,
    degree,
    experience,
    about,
    fees,
    address: JSON.parse(address),
    date: Date.now(),
  };

  await doctorModel.create(doctorData);

  return {
    success: true,
    message: "Doctor added successfully",
  };
};

// ================= GET ALL DOCTORS =================
export const allDoctorsService = async () => {
  const doctors = await doctorModel.find({}).select("-password");

  return {
    success: true,
    doctors,
  };
};


// ================= GET DOCTOR BY ID =================
export const getDoctorByIdService = async (doctorId) => {
  const doctor = await doctorModel
    .findById(doctorId)
    .select("-password");

  if (!doctor) {
    return { success: false, message: "Doctor not found" };
  }

  return {
    success: true,
    doctor,
  };
};



// ================= UPDATE DOCTOR =================
export const updateDoctorByIdService = async (doctorId, data, file) => {
  let updateData = {
    name: data.name,
    speciality: data.speciality,
    degree: data.degree,
    experience: data.experience,
    fees: data.fees,
    about: data.about,
    available: data.available,
    address: data.address ? JSON.parse(data.address) : undefined,
  };

  if (file) {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });
    updateData.image = uploaded.secure_url;
  }

  await doctorModel.findByIdAndUpdate(doctorId, updateData);

  return {
    success: true,
    message: "Doctor updated successfully",
  };
};


// ================= DELETE DOCTOR =================
export const deleteDoctorByIdService = async (doctorId) => {
  await doctorModel.findByIdAndDelete(doctorId);

  return {
    success: true,
    message: "Doctor deleted successfully",
  };
};