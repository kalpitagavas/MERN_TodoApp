const express = require("express");
const { signup, login, logout, verifyOTP, resendOTP } = require("../controller/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verifyotp", verifyOTP);
router.post("/resendotp", resendOTP);
module.exports = router;
