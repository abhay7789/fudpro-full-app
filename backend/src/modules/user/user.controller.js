const User = require('./user.model');
const Address = require('./address.model');
const bcrypt = require('bcryptjs');
const logger = require('../../shared/utils/logger');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Address, as: 'addresses' },
        { model: require('../role/role.model'), as: 'roleData' }
      ]
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { name, email, phone } = req.body;
    
    await user.update({ name, email, phone });
    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { addressLine, city, pincode, type } = req.body;
    
    const newAddress = await Address.create({
      userId: req.user.id,
      addressLine,
      city,
      pincode,
      type
    });

    res.status(201).json({ success: true, data: newAddress, message: 'Address added successfully' });
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { addressLine, city, pincode, type } = req.body;
    const address = await Address.findOne({ where: { id, userId: req.user.id } });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await address.update({ addressLine, city, pincode, type });
    res.json({ success: true, message: 'Address updated successfully', data: address });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ where: { id, userId: req.user.id } });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await address.destroy();
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};
