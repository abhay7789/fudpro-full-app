const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Order = sequelize.define('Order', {
  ...auditFields,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PLACED',
    validate: {
      isIn: [['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']]
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'orders',
  timestamps: false,
});

addAuditHooks(Order);

module.exports = Order;
