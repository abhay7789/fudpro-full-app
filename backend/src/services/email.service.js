const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../shared/utils/logger');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendOTP = async (email, otp) => {
  if (!config.email.enableOtp || !email) {
    logger.info(`Email OTP disabled or no email provided. Using default OTP: ${config.email.defaultOtp}`);
    return { success: true, otp: config.email.defaultOtp };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Mumbai Dabbawala System" <${config.email.user}>`,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP for login is: ${otp}`,
      html: `<b>Your OTP for login is: ${otp}</b>`,
    });

    logger.info(`OTP Email sent: ${info.messageId}`);
    return { success: true, otp };
  } catch (error) {
    logger.error('Failed to send OTP Email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTP };
