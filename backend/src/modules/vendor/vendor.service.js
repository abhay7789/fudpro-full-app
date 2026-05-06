const MenuItem = require('../menu/menuItem.model');
const Category = require('../category/category.model');
const Vendor = require('./vendor.model');

const getVendorProfile = async (userId) => {
  const vendor = await Vendor.findOne({ where: { userId } });
  if (!vendor) throw { status: 404, message: 'Vendor profile not found' };
  return vendor;
};

const getMenu = async (userId) => {
  const vendor = await getVendorProfile(userId);
  return await MenuItem.findAll({
    where: { vendorId: vendor.id },
    attributes: ['id', 'name', 'description', 'price', 'isAvailable', 'categoryId', 'image'],
    include: [{ 
      model: Category, 
      as: 'category',
      attributes: ['name']
    }]
  });
};

const addMenuItem = async (userId, data) => {
  const vendor = await getVendorProfile(userId);
  
  // Validate category
  const category = await Category.findByPk(data.categoryId);
  if (!category) throw { status: 400, message: 'Invalid category ID' };

  return await MenuItem.create({
    vendorId: vendor.id,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    image: data.image || null
  });
};

const updateMenuItem = async (userId, menuId, data) => {
  const vendor = await getVendorProfile(userId);
  
  const menuItem = await MenuItem.findOne({ where: { id: menuId, vendorId: vendor.id } });
  if (!menuItem) throw { status: 404, message: 'Menu item not found or unauthorized' };

  await menuItem.update(data);
  return menuItem;
};

const deleteMenuItem = async (userId, menuId) => {
  const vendor = await getVendorProfile(userId);
  
  const menuItem = await MenuItem.findOne({ where: { id: menuId, vendorId: vendor.id } });
  if (!menuItem) throw { status: 404, message: 'Menu item not found or unauthorized' };

  await menuItem.destroy();
  return { message: 'Menu item deleted successfully' };
};

const updateVendorProfile = async (userId, data) => {
  const vendor = await getVendorProfile(userId);
  await vendor.update(data);
  return vendor;
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};
