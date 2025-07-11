const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const sendOTP = require("../utils/sendOTP");

//Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const signup = async (req, res) => {
  try {
    const { name, email, password, avatar, role, isActive } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expireotp = Date.now() * 5 * 60 * 1000;
    const newUser = await new UserModel({
      name,
      email,
      password: hashPassword,
      avatar,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
      verifyOTP: otp,
      verifyOTPExpireAt: otpExpire,
    }).save();
    await sendOTP(email, otp);
    const token = jwt.sign({ user: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //whenever its run on https then true otherwise false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: "User Register Successfully", user: newUser });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while sign up", message: err.message });
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User is invalid" });
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
    res.status(500).json({ msg: "Error in login", error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: err.message });
  }
};

module.exports = { signup, login, logout };
