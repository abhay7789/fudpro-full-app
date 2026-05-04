const Address = require('./address.model');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { addressLine, city, pincode, type } = req.body;
    const address = await Address.create({
      userId: req.user.id,
      addressLine,
      city,
      pincode,
      type
    });
    res.json({ success: true, message: 'Address added successfully', data: address });
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

    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.pincode = pincode || address.pincode;
    address.type = type || address.type;

    await address.save();
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
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
