const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("./email.service");

exports.registerUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  return user;
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No user found with this email");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    return { success: true, data: "Email sent" };
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error("Email could not be sent");
  }
};
