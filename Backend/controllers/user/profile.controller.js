import {
  getProfileService,
  updateProfileService,
  checkUsernameService,
  changeUsernameService,
} from "../../services/user/profile.service.js";

//  GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getProfileService(userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;
    const file = req.file;

    const result = await updateProfileService(userId, data, file);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  CHECK USERNAME 
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const result = await checkUsernameService(username);
    return res.json(result);
  } catch (error) {
    return res.json({
      available: false,
      message: error.message,
    });
  }
};

// CHANGE USERNAME 
export const changeUsername = async (req, res) => {
  try {
    const userId = req.userId;
    const { newUsername } = req.body;

    const result = await changeUsernameService(userId, newUsername);
    return res.json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This username is not available",
      });
    }

    return res.json({
      success: false,
      message: error.message,
    });
  }
};
