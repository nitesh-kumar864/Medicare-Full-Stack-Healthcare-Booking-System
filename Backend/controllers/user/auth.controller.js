import {
 signupService,
  verifySignupOtpService,
  loginService,
  googleLoginService,
  forgotPasswordService,
  resetPasswordService,
  checkAuthService,
} from "../../services/user/auth.service.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const result = await  signupService(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY SIGNUP OTP
export const verifySignupOtp = async (req, res) => {
  try {
    const result = await verifySignupOtpService(req.body, res);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  LOGIN 
export const loginUser = async (req, res) => {
  try {
    const result = await loginService(req.body, res);
    return res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//  GOOGLE LOGIN 
export const googlePatientLogin = async (req, res) => {
  try {
    const result = await googleLoginService(req.body, res);
    return res.json(result);
  } catch (error) {
    console.error("Google login error:", error);
    return res.json({
      success: false,
      message: "Google login failed",
    });
  }
};

//  FORGOT PASSWORD 
export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await resetPasswordService(token, password);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Reset failed",
    });
  }
};

//  CHECK AUTH 
export const checkAuth = async (req, res) => {
  try {
    const result = await checkAuthService();
    return res.json(result);
  } catch (error) {
    return res.json({ success: false });
  }
};
