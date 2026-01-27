import userModel from "../models/userModel.js";

const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  let exists = await userModel.findOne({ username });
  let counter = 1;

  while (exists) {
    username = `${baseUsername}_${counter}`;
    exists = await userModel.findOne({ username });
    counter++;
  }

  return username;
};

export default generateUniqueUsername;
