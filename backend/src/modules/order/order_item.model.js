const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const OrderItem = sequelize.define('OrderItem', {
  ...auditFields,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'order_items',
  timestamps: false,
});

addAuditHooks(OrderItem);

module.exports = OrderItem;
