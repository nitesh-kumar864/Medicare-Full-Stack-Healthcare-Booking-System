import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../../models/doctorModel.js";

import crypto from "crypto";
import sendEmail from "../../mail/sendEmail.js";
import { resetPasswordTemplate } from
  "../../mail/emailTemplates/resetPasswordTemplate.js";
import { resetPasswordSuccessTemplate } from
  "../../mail/emailTemplates/resetPasswordSuccessTemplate.js";

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


// ================= FORGOT DOCTOR PASSWORD =================

export const forgotDoctorPasswordService = async ({ email }) => {
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const doctor = await doctorModel.findOne({
    email: normalizedEmail,
  });

  if (!doctor) {
    return {
      success: false,
      message: "Account does not exist",
    };
  }

  // Rate limit reset requests.
  if (
    doctor.lastPasswordResetRequest &&
    Date.now() -
    new Date(doctor.lastPasswordResetRequest).getTime() <
    2 * 60 * 1000
  ) {
    return {
      success: false,
      status: 429,
      message: "Please wait 2 minutes before requesting again",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  doctor.lastPasswordResetRequest = new Date();
  doctor.resetPasswordToken = hashedToken;
  doctor.resetPasswordExpire = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await doctor.save();

  const resetURL =
    `${process.env.ADMIN_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: doctor.email,
    subject: "Reset your Medicare password",
    html: resetPasswordTemplate({
      name: doctor.name,
      resetURL,
    }),
  });

  return {
    success: true,
    message: "Reset link sent successfully",
  };
};



// ================= RESET DOCTOR PASSWORD =================
export const resetDoctorPasswordService = async (
  token,
  password
) => {
  if (!token) {
    return {
      success: false,
      status: 400,
      message: "Invalid or expired reset link",
    };
  }

  if (!password) {
    return {
      success: false,
      status: 400,
      message: "Password is required",
    };
  }
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\])[A-Za-z\d@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\]{8,}$/


  if (!strongPasswordRegex.test(password)) {
    return {
      success: false,
      message:
        "Password must be at least 8 chars include uppercase, lowercase, number, and special character",
    };
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");


  const doctor = await doctorModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });


  if (!doctor) {
    return {
      success: false,
      status: 400,
      message: "Invalid or expired reset link",
    };
  }

  // Hash the new password.
  doctor.password = await bcrypt.hash(password, 10);

  // Make the reset link single-use.
  doctor.resetPasswordToken = undefined;
  doctor.resetPasswordExpire = undefined;

  await doctor.save();

  await sendEmail({
    to: doctor.email,
    subject: "Your Medicare password has been changed",
    html: resetPasswordSuccessTemplate({
      name: doctor.name,
    }),
  });


  return {
    success: true,
    status: 200,
    message: "Password reset successful",
  };
};