const authService = require('./auth.service');
const logger = require('../../shared/utils/logger');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password, otp, mode } = req.body;
    let result;

    if (mode === 'OTP') {
      if (otp) {
        result = await authService.verifyOTP(identifier, otp);
      } else {
        result = await authService.loginWithOTP(identifier);
        return res.status(200).json({ success: true, message: 'OTP sent' });
      }
    } else {
      result = await authService.loginWithPassword(identifier, password);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
