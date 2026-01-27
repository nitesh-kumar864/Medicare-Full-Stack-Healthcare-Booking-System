import { v2 as cloudinary } from "cloudinary";
import userModel from "../../models/userModel.js";
import validateUsername from "../../utils/validateUsername.js";

// ------------- GET PROFILE  -------------
export const getProfileService = async (userId) => {
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    userData: user,
  };
};


// UPDATE PROFILE 
export const updateProfileService = async (userId, data, file) => {
  const { name, phone, dob, gender, address } = data;

  //  BASIC VALIDATION 
  if (!name || !phone || !dob || !gender) {
    return {
      success: false,
      message: "Please complete all required fields",
    };
  }

  if (phone.length !== 10 || phone === "0000000000") {
    return {
      success: false,
      message: "Please enter a valid 10-digit phone number",
    };
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return {
      success: false,
      message: "Invalid gender",
    };
  }


  if (isNaN(Date.parse(dob))) {
    return {
      success: false,
      message: "Invalid date of birth",
    };
  }

  // PARSE ADDRESS 
  let parsedAddress = {};
  try {
    parsedAddress = address ? JSON.parse(address) : {};
  } catch {
    return {
      success: false,
      message: "Invalid address format",
    };
  }

  // PREPARE UPDATE OBJECT 
  const updateData = {
    name,
    phone,
    dob,
    gender,
    address: parsedAddress,
  };

  //  IMAGE UPLOAD 
  if (file) {
    const uploadRes = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });
    updateData.image = uploadRes.secure_url;
  }

  // UPDATE USER 
  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
    .select("-password");

  if (!updatedUser) {
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  };
};


// ------------- CHECK USERNAME -------------
export const checkUsernameService = async (username) => {
  if (!username) {
    return {
      available: false,
      message: "Username is required",
    };
  }

  const result = await validateUsername(username);

  return {
    available: result.valid,
    message: result.valid ? "Username available" : result.message,
  };
};

// -------------- CHANGE USERNAME --------------
export const changeUsernameService = async (userId, newUsername) => {
  if (!newUsername) {
    return {
      success: false,
      message: "New username is required",
    };
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const result = await validateUsername(newUsername);
  if (!result.valid) {
    return {
      success: false,
      message: result.message,
    };
  }

  user.username = result.username;
  user.usernameChanged = true;
  await user.save();

  return {
    success: true,
    message: "Username updated successfully",
    username: user.username,
  };
};