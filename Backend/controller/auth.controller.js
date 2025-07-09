const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const signup = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await UserModel.find({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await new UserModel({
      name,
      email,
      password: hashPassword,
    }).save();
    res.status(200).json({ msg: "User Register Successfully", user: newUser });
  } catch (err) {
    res.status(400).send("Error while sign up", err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.find({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User is invalid" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      return res.status(200).json({ msg: "Invalid Email or password" });

    const token = generatetoken(user._id, user.role);
    res.status(200).json({
      msg: "User Logged Successfully",
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
    res.status(400).json({ msg: "Error in Login" });
  }
};

module.exports = { signup, login };
