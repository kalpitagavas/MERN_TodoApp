const ratelimit = require("express-rate-limit");
// General API rate limiter: 10 requests per 15 minutes
const limiter = ratelimit({
  WindowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "To many request from this IP,try again after 15 mins",
  },
});
//  OTP-specific limiter: 5 requests per 10 minutes
const otpLimiter = ratelimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "To many OTP request from this IP,try again after 10 mins",
  },
});
module.exports = { limiter, otpLimiter };
