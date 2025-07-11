const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Todo App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify Your OTP",
    html: `
      <h2>Welcome to Todo App 👋</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
