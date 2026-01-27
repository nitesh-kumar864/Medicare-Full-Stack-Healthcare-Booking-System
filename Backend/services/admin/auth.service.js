import jwt from "jsonwebtoken";

// ================= ADMIN LOGIN =================
export const loginAdminService = async ({ email, password }) => {
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

 
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Generate JWT
  const token = jwt.sign(
    {
      email,
      role: "admin",  
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    success: true,
    message: "Admin logged in successfully",
    token,
  };
};


// ================= GET ADMIN PROFILE =================
export const getAdminProfileService = async () => {
  return {
    success: true,
    adminData: {
      email: process.env.ADMIN_EMAIL,
    },
  };
};