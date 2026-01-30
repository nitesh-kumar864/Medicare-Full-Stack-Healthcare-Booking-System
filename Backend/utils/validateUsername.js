import userModel from "../models/userModel.js";

export const validateUsername = async (username) => {
  if (!username) {
    return { valid: false, message: "Username required" };
  }

  username = username.toLowerCase().trim();

  const usernameRegex = /^[a-z0-9._]+$/;

  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: "Only lowercase letters, numbers, dot (.) and underscore (_) are allowed",
    };
  }

  if (username.length < 4) {
    return {
      valid: false,
      message: "Username must be at least 4 characters",
    };
  }

  if (username.length > 15) {
    return {
      valid: false,
      message: "Username cannot exceed 15 characters",
    };
  }


  const reserved = ["admin", "doctor", "support", "user", "unknown", "known", "autonomous"];
  if (reserved.includes(username)) {
    return { valid: false, message: "This username is reserved" };
  }

  const exists = await userModel.findOne({ username });
  if (exists) {
    return { valid: false, message: "This username is already taken" };
  }

  return { valid: true, username };
};

export default validateUsername;