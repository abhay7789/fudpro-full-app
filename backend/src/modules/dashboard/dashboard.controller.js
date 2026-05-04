const User = require('../user/user.model');
const Vendor = require('../vendor/vendor.model');
const Order = require('../order/order.model');

const getAdminDashboard = async (req, res, next) => {
  try {
    const activeVendors = await Vendor.count({ where: { isActive: true } });
    const todayOrders = await Order.count();
    const todayRevenueResult = await Order.sum('totalAmount', { where: { status: 'DELIVERED' } });
    const todayRevenue = todayRevenueResult || 0; 

    const preparingOrders = await Order.count({ where: { status: 'PREPARING' } });

    res.json({
      success: true,
      data: {
        activeVendors,
        todayOrders,
        todayRevenue,
        preparingOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSuperAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await Vendor.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount', { where: { status: 'DELIVERED' } }) || 0;
    
    // Placeholder for delivery success rate
    const deliveredCount = await Order.count({ where: { status: 'DELIVERED' } });
    const deliverySuccessRate = totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(2) + '%' : 'N/A';

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue,
        activeSubscriptions: 0, // Placeholder
        deliverySuccessRate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getSuperAdminDashboard
};
