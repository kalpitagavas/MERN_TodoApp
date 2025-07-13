const express = require("express");
const { body, validator, validationResult } = require("express-validator");
const {
  signup,
  login,
  logout,
  verifyOTP,
  resendOTP,
} = require("../controller/auth.controller");
const { otpLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User signed up successfully
 */
router.post(
  "/signup",
  [
    body("name", "Name is Required").notEmpty(),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be 6+chars").isLength({ min: 6 }),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      next();
    },
  ],
  signup
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be 6+chars ").isLength({ min: 6 }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  login
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", logout);

/**
 * @swagger
 * /verifyotp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post(
  "/verifyotp",
  otpLimiter,
  [
    body("email", "Enter a valid Email").isEmail(),
    body("otp", "Enter valid Otp").notEmpty().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      next();
    },
  ],
  verifyOTP
);

/**
 * @swagger
 * /resendotp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.post(
  "/resendotp",
  otpLimiter,
  [
    body("email", "Enter a valid Email").isEmail(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ],
  resendOTP
);

module.exports = router;
