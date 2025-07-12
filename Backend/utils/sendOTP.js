// const nodemailer = require("nodemailer");

// const sendOTP = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"Todo App" <${process.env.MAIL_USER}>`,
//     to: email,
//     subject: "Verify Your OTP",
//     html: `
//       <h2>Welcome to Todo App 👋</h2>
//       <p>Your OTP code is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP is valid for 5 minutes.</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendOTP;
const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"MyApp OTP" <otp@myapp.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendOTP;
