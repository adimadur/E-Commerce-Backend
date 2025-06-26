const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
