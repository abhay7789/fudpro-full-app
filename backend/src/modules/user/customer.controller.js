const { Op } = require('sequelize');
const Vendor = require('../vendor/vendor.model');
const MenuItem = require('../menu/menuItem.model');
const Category = require('../category/category.model');
const { getPagination, getPagingData } = require('../../shared/utils/pagination');

const getVendors = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];

    const vendors = await Vendor.findAndCountAll({ 
      where: { 
        isActive: true,
        startTime: { [Op.lte]: currentTime },
        endTime: { [Op.gte]: currentTime }
      },
      include: [{
        model: MenuItem,
        as: 'menuItems',
        attributes: [],
        required: true, // Only vendors with at least one menu item
        where: { isAvailable: true }
      }],
      attributes: ['id', 'restaurantName', 'description', 'imageUrl', 'coverImage'],
      distinct: true,
      limit,
      offset
    });
    
    const response = getPagingData(vendors, page, limit);
    res.json({ success: true, ...response });
  } catch (error) {
    next(error);
  }
};

const getVendorMenu = async (req, res, next) => {
  try {
    const vendorId = req.params.id;
    const menuItems = await MenuItem.findAll({
      where: { vendorId, isAvailable: true },
      attributes: ['id', 'name', 'description', 'price', 'categoryId'],
      include: [{ 
        model: Category, 
        as: 'category',
        attributes: ['name']
      }]
    });

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      const catName = item.category ? item.category.name : 'Uncategorized';
      if (!acc[catName]) acc[catName] = [];
      
      // Strip out the nested category object from the response payload
      const { category, ...itemData } = item.toJSON();
      acc[catName].push(itemData);
      
      return acc;
    }, {});

    res.json({ success: true, data: groupedMenu });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name']
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendors,
  getVendorMenu,
  getCategories
};
