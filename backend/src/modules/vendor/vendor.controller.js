const vendorService = require('./vendor.service');

const getMenu = async (req, res, next) => {
  try {
    const menu = await vendorService.getMenu(req.user.id);
    res.json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

const addMenuItem = async (req, res, next) => {
  try {
    const item = await vendorService.addMenuItem(req.user.id, req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await vendorService.updateMenuItem(req.user.id, req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const result = await vendorService.deleteMenuItem(req.user.id, req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await vendorService.getVendorProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await vendorService.updateVendorProfile(req.user.id, req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};
