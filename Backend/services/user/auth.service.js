import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import userModel from "../../models/userModel.js";
import otpModel from "../../models/otpModel.js";

import validateUsername from "../../utils/validateUsername.js";
import generateUniqueUsername from "../../utils/usernameHelper.js";
import generateTokenAndSetCookies from "../../utils/generateTokenAndSetCookies.js";

import sendEmail from "../../mail/sendEmail.js";
import { signupOtpTemplate } from "../../mail/emailTemplates/signupOtpTemplate.js";
import { resetPasswordTemplate } from "../../mail/emailTemplates/resetPasswordTemplate.js";
import { resetPasswordSuccessTemplate } from "../../mail/emailTemplates/resetPasswordSuccessTemplate.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// SIGNUP
export const signupService = async ({ name, username, email, password }) => {
    if (!name || !email || !password || !username) {
        return { success: false, message: "All fields are required" };
    }

    email = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: "Please enter a valid email address" };
    }

    const usernameResult = await validateUsername(username);
    if (!usernameResult.valid) {
        return { success: false, message: usernameResult.message };
    }

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
        return { success: false, message: "Please enter a strong password" };
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return { success: false, message: "User already registered" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await otpModel.deleteMany({ email });
    await otpModel.create({
        email,
        otpHash,
        expiresAt: Date.now() + 15 * 60 * 1000,
    });

    await sendEmail({
        to: email,
        subject: "Verify your Medicare account",
        html: signupOtpTemplate({
            userName: name,
            verificationCode: otp,
        }),
    });

    return { success: true, message: "OTP sent to email" };
};

// VERIFY SIGNUP OTP
export const verifySignupOtpService = async ({ name, username, email, password, otp }, res) => {
    const record = await otpModel.findOne({ email });
    if (!record) {
        return { success: false, message: "OTP not found" };
    }

    if (record.expiresAt < Date.now()) {
        await otpModel.deleteOne({ email });
        return { success: false, message: "OTP expired" };
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== record.otpHash) {
        return { success: false, message: "Invalid OTP" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    await otpModel.deleteOne({ email });

    const token = generateTokenAndSetCookies(res, user._id);

    return {
        success: true,
        message: "Account created successfully",
        token,
        user: { ...user._doc, password: undefined },
    };
};


//  LOGIN 
export const loginService = async ({ identifier, password }, res) => {
    if (!identifier || !password) {
        return { success: false, message: "All fields are required" };
    }

    identifier = identifier.toLowerCase().trim();

    const user = identifier.includes("@")
        ? await userModel.findOne({ email: identifier })
        : await userModel.findOne({ username: identifier });

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { success: false, message: "Invalid credentials" };
    }

    const token = generateTokenAndSetCookies(res, user._id);

    return {
        success: true,
        message: "Logged in successfully",
        token,
        user: { ...user._doc, password: undefined },
    };
};


// ================= GOOGLE LOGIN =================
export const googleLoginService = async ({ credential }, res) => {
    if (!credential) {
        return { success: false, message: "Google token missing" };
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const name = payload.name;
    const email = payload.email.toLowerCase();
    const picture = payload.picture;
    const googleId = payload.sub;

    let user = await userModel.findOne({ email });

    if (!user) {
        const baseUsername = email.split("@")[0];
        const uniqueUsername = await generateUniqueUsername(baseUsername);

        user = await userModel.create({
            name: payload.name,
            username: uniqueUsername,
            email,
            password: "",
            googleId: payload.sub,
            isGoogleUser: true,
            image: payload.picture,
        });
    }

    const token = generateTokenAndSetCookies(res, user._id);

    return {
        success: true,
        message: "Google login successful",
        token,
        userData: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            image: user.image,
        },
    };
};

// FORGOT PASSWORD 
export const forgotPasswordService = async ({ identifier }) => {
    if (!identifier) {
        return { success: false, message: "Email or username is required" };
    }

    const user = identifier.includes("@")
        ? await userModel.findOne({ email: identifier })
        : await userModel.findOne({ username: identifier });

    if (!user) {
        return { success: true, message: "No user found" };
    }

    if (
        user.lastPasswordResetRequest &&
        Date.now() - user.lastPasswordResetRequest.getTime() < 120 * 1000
    ) {
        return {
            success: false,
            message: "Please wait 2 minute before requesting again",
        };
    }

    user.lastPasswordResetRequest = new Date();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: resetPasswordTemplate({
            name: user.name,
            resetURL,
        }),
    });

    // mark email
    const [local, domain] = user.email.split("@");
    let maskedEmail;

    if (local.length <= 5) {
        maskedEmail = local[0] + "***@" + domain;
    } else {
        maskedEmail =
            local.slice(0, 2) + "***" + local.slice(-3) + "@" + domain;
    }

    return {
        success: true,
        message: "Reset link sent successfully",
        cooldown: 120,
    };

};

// RESET PASSWORD
export const resetPasswordService = async (token, password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\]).{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    return {
      success: false,
      message:
        "Password must be at least 8 chars include uppercase, lowercase, number, and special character",
    };
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return { success: false, message: "Invalid or expired reset link" };
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your password has been changed",
    html: resetPasswordSuccessTemplate({ name: user.name }),
  });

  return { success: true, message: "Password reset successful" };
};

//  CHECK AUTH
export const checkAuthService = async () => {
  return { success: true };
};