const User = require('../user/user.model');
const Role = require('../role/role.model');
const Vendor = require('../vendor/vendor.model');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/db');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Role, as: 'roleData' },
        { model: Vendor, as: 'vendorProfile' }
      ],
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, phone, password, roleName, restaurantName, description } = req.body;
    
    const role = await Role.findOne({ where: { name: roleName }, transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Creating user with data:', { name, email, phone, roleName, restaurantName });
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      roleId: role.id
    }, { transaction: t });

    if (roleName === 'VENDOR') {
      if (!restaurantName) {
        console.error('Restaurant name missing for vendor');
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Restaurant name is required for vendor' });
      }

      let coverImageBuffer = null;
      if (req.body.coverImage && typeof req.body.coverImage === 'string' && req.body.coverImage.includes('base64')) {
        console.log('Processing cover image buffer');
        const base64Data = req.body.coverImage.replace(/^data:image\/\w+;base64,/, "");
        coverImageBuffer = Buffer.from(base64Data, 'base64');
      }

      console.log('Creating vendor profile');
      await Vendor.create({
        userId: user.id,
        restaurantName,
        description: description || null,
        coverImage: coverImageBuffer
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error('User creation failed:', error);
    await t.rollback();
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, password } = req.body;
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = await bcrypt.hash(password, 10);
    
    await user.save();

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserStatus,
  deleteUser
};
