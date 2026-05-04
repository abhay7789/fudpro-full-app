const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const OrderHistory = sequelize.define('OrderHistory', {
  ...auditFields,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'order_histories',
  timestamps: false,
});

addAuditHooks(OrderHistory);

module.exports = OrderHistory;
