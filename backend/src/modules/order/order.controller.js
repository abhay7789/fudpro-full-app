const Order = require('./order.model');
const OrderItem = require('./order_item.model');
const OrderHistory = require('./order_history.model');
const MenuItem = require('../menu/menuItem.model');
const Vendor = require('../vendor/vendor.model');
const { sequelize } = require('../../config/db');
const { getPagination, getPagingData } = require('../../shared/utils/pagination');

const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { vendorId, items, paymentMethod } = req.body;
    
    // Fetch vendor for time window check
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) throw { status: 404, message: 'Vendor not found' };

    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    const [startH, startM, startS] = vendor.startTime.split(':').map(Number);
    const [endH, endM, endS] = (vendor.endTime || '22:00:00').split(':').map(Number);
    const startTimeInSec = startH * 3600 + startM * 60 + (startS || 0);
    const endTimeInSec = endH * 3600 + endM * 60 + (endS || 0);

    if (currentTime < startTimeInSec || currentTime > endTimeInSec) {
      throw { status: 400, message: `Vendor is currently closed. Ordering hours: ${vendor.startTime} - ${vendor.endTime}` };
    }
    
    // Fetch prices from DB
    const menuItemIds = items.map(i => i.menuItemId || i.id);
    const dbItems = await MenuItem.findAll({
      where: { id: menuItemIds }
    });

    let totalAmount = 0;
    const orderItemsData = items.map(item => {
      const dbItem = dbItems.find(di => di.id === (item.menuItemId || item.id));
      if (!dbItem) throw { status: 400, message: `Menu item ${item.menuItemId || item.id} not found` };
      
      const price = dbItem.price;
      totalAmount += price * item.quantity;
      
      return {
        menuItemId: dbItem.id,
        quantity: item.quantity,
        price: price
      };
    });

    // Add COD charge (₹30 extra)
    if (paymentMethod === 'COD') {
      totalAmount += 30.0;
    }

    const order = await Order.create({
      userId: req.user.id,
      vendorId,
      totalAmount,
      status: 'PLACED'
    }, { transaction: t });

    const orderItems = orderItemsData.map(item => ({
      ...item,
      orderId: order.id
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await OrderHistory.create({
      orderId: order.id,
      status: 'PLACED',
      comment: 'Order placed successfully'
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};


const getOrders = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    let whereClause = {};
    if (req.user.role === 'VENDOR') {
      const Vendor = require('../vendor/vendor.model');
      const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
      if (!vendor) throw { status: 404, message: 'Vendor profile not found' };
      whereClause = { vendorId: vendor.id };
    } else {
      whereClause = { userId: req.user.id };
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: MenuItem, as: 'menuItem' }]
        },
        { model: OrderHistory, as: 'history' },
        { 
          model: require('../user/user.model'), 
          as: 'user', 
          attributes: ['name', 'email', 'mobileNumber'] 
        }
      ],
      distinct: true,
      limit,
      offset,
      order: [['id', 'DESC']]
    });
    
    const response = getPagingData(orders, page, limit);
    res.json({ success: true, ...response });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const order = await Order.findByPk(id);
    if (!order) throw { status: 404, message: 'Order not found' };

    await order.update({ status });

    await OrderHistory.create({
      orderId: id,
      status,
      comment
    });

    res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
