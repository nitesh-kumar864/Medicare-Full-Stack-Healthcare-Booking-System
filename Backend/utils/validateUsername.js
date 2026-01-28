import userModel from "../models/userModel.js";

export const validateUsername = async (username) => {
  if (!username) {
    return { valid: false, message: "Username required" };
  }

  username = username.toLowerCase().trim();

  if (!/^[a-z0-9._]{4,15}$/.test(username)) {
    return { valid: false,  message: "a-z, 0-9, dot (.), and underscore (_) only allowed" };
  }

  const reserved = ["admin", "doctor", "support","user","unknown","known","autonomous"];
  if (reserved.includes(username)) {
    return { valid: false, message: "This username is reserved" };
  }

  const exists = await userModel.findOne({ username });
  if (exists) {
    return { valid: false, message: "This username is already taken"};
  }

  return { valid: true, username };
};

export default validateUsername;