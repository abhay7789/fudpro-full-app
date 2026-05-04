const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../user/user.model');
const config = require('../../config/env');
const { sendOTP } = require('../../services/email.service');
const logger = require('../../shared/utils/logger');

const Role = require('../role/role.model');

const generateToken = (user) => {
  const roleName = user.roleData ? user.roleData.name : (user.role || 'USER');
  const payload = {
    id: user.id,
    role: roleName,
    phone: user.phone
  };
  
  if (!payload.id) {
    logger.error('Failed to generate token: Missing user ID', user);
    throw new Error('Token generation failed: Missing user ID');
  }

  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const formatUserResponse = (user) => {
  const userJson = user.toJSON ? user.toJSON() : user;
  return {
    ...userJson,
    role: user.roleData ? user.roleData.name : (user.role || 'USER')
  };
};

const detectInputType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/; // Basic 10-digit check

  if (emailRegex.test(input)) return 'email';
  if (phoneRegex.test(input)) return 'phone';
  return 'unknown';
};

const register = async (userData) => {
  const { name, email, phone, password } = userData;

  if (!phone) {
    throw { status: 400, message: 'Phone number is required' };
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ phone }, ...(email ? [{ email }] : [])]
    }
  });

  if (existingUser) {
    throw { status: 400, message: 'User already exists with this phone or email' };
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const defaultRole = await Role.findOne({ where: { name: 'USER' } });
  if (!defaultRole) {
    logger.error('Default USER role not found');
    throw { status: 500, message: 'Configuration error: Default role not found' };
  }

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    roleId: defaultRole.id
  });

  user.roleData = defaultRole;

  const token = generateToken(user);
  return { user: formatUserResponse(user), token };
};

const loginWithPassword = async (identifier, password) => {
  const type = detectInputType(identifier);
  if (type === 'unknown') throw { status: 400, message: 'Invalid phone or email format' };

  const user = await User.findOne({ 
    where: { [type]: identifier },
    include: [{ model: Role, as: 'roleData' }]
  });
  if (!user || !user.password) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = generateToken(user);
  return { user: formatUserResponse(user), token };
};

const loginWithOTP = async (identifier) => {
  const type = detectInputType(identifier);
  if (type === 'unknown') throw { status: 400, message: 'Invalid phone or email format' };

  const user = await User.findOne({ 
    where: { [type]: identifier },
    include: [{ model: Role, as: 'roleData' }]
  });
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  // Generate a random 4-digit OTP
  const otp = config.email.defaultOtp; // Using default for now as per requirement

  if (type === 'email' && user.email) {
    await sendOTP(user.email, otp);
  } else {
    logger.info(`OTP ${otp} sent to phone ${user.phone} (Simulation)`);
  }

  return { message: 'OTP sent successfully', identifier };
};

const verifyOTP = async (identifier, otp) => {
  if (otp !== config.email.defaultOtp) {
    throw { status: 401, message: 'Invalid OTP' };
  }

  const type = detectInputType(identifier);
  const user = await User.findOne({ 
    where: { [type]: identifier },
    include: [{ model: Role, as: 'roleData' }]
  });
  
  if (!user) throw { status: 404, message: 'User not found' };

  const token = generateToken(user);
  return { user: formatUserResponse(user), token };
};

const getProfile = async (id) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: 'roleData' }]
  });
  if (!user) throw { status: 404, message: 'User not found' };
  return formatUserResponse(user);
};

module.exports = {
  register,
  loginWithPassword,
  loginWithOTP,
  verifyOTP,
  getProfile
};
