const User = require('../modules/user/user.model');
const Address = require('../modules/user/address.model');
const Order = require('../modules/order/order.model');
const OrderItem = require('../modules/order/order_item.model');
const OrderHistory = require('../modules/order/order_history.model');
const Subscription = require('../modules/order/subscription.model');
const Delivery = require('../modules/delivery/delivery.model');
const Payment = require('../modules/payment/payment.model');
const Notification = require('../modules/notification/notification.model');

// New Models
const Role = require('../modules/role/role.model');
const Vendor = require('../modules/vendor/vendor.model');
const Category = require('../modules/category/category.model');
const MenuItem = require('../modules/menu/menuItem.model');

const setupAssociations = () => {
  // Role <-> User
  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'roleData' });

  // User <-> Vendor
  User.hasOne(Vendor, { foreignKey: 'userId', as: 'vendorProfile' });
  Vendor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Vendor <-> MenuItem
  Vendor.hasMany(MenuItem, { foreignKey: 'vendorId', as: 'menuItems' });
  MenuItem.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

  // Category <-> MenuItem
  Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'menuItems' });
  MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  // Vendor <-> Order
  Vendor.hasMany(Order, { foreignKey: 'vendorId', as: 'orders' });
  Order.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

  // MenuItem <-> OrderItem
  MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId', as: 'orderItems' });
  OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

  // User <-> Address
  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
  Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // User <-> Order
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Order <-> OrderItem
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Order <-> OrderHistory
  Order.hasMany(OrderHistory, { foreignKey: 'orderId', as: 'history' });
  OrderHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Order <-> Delivery
  Order.hasOne(Delivery, { foreignKey: 'orderId', as: 'delivery' });
  Delivery.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Order <-> Payment
  Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
  Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // User <-> Subscription
  User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
  Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // User <-> Notification
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Delivery <-> Dabbawala (User)
  User.hasMany(Delivery, { foreignKey: 'dabbawalaId', as: 'tasks' });
  Delivery.belongsTo(User, { foreignKey: 'dabbawalaId', as: 'dabbawala' });
};

module.exports = setupAssociations;
