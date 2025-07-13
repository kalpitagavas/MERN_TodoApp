const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const sendOTP = require("../utils/sendOTP");

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, avatar, role, isActive } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      avatar,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
      verifyOTP: otp,
      verifyOTPExpireAt: otpExpireAt,
      isAccountVerified: false,
    });

    await newUser.save();
    await sendOTP(email, otp);

    const token = jwt.sign({ user: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAccountVerified: newUser.isAccountVerified,
      },
    });
  } catch (err) {
    // res.status(400).json({ error: "Signup failed", message: err.message });
    next(err);
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.verifyOTP !== otp || user.verifyOTPExpireAt < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();

    res.status(200).json({
      msg: "Account verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    //  res.status(400).json({ msg: "OTP verification error", error: err.message });
    next(err);
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = generateOTP();
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ msg: "OTP resent to email" });
  } catch (err) {
    //res.status(400).json({ msg: "Failed to resend OTP", error: err.message });
    next(err);
  }
};

// Send OTP for Password Reset
const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ msg: "Reset OTP sent to email" });
  } catch (err) {
    // res
    //   .status(400)
    //   .json({ msg: "Error sending reset OTP", error: err.message });
    next(err);
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.resetOTP !== otp || user.resetOTPExpireAt < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newpassword, 10);
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();

    res.status(200).json({ msg: "Password has been reset successfully" });
  } catch (err) {
    //  res.status(400).json({ msg: "Reset failed", error: err.message });
    next(err);
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(400).json({ msg: "User is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ user: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    user.lastLogin = new Date();
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    //  res.status(500).json({ msg: "Error in login", error: err.message });
    next(err);
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    // res
    //   .status(500)
    //    .json({ success: false, message: "Logout failed", error: err.message });
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  resendOTP,
  verifyOTP,
  sendResetOTP,
  resetPassword,
};
