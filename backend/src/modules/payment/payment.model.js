const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Payment = sequelize.define('Payment', {
  ...auditFields,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
    defaultValue: 'PENDING',
  },
  method: {
    type: DataTypes.ENUM('UPI', 'COD', 'CARD', 'NET_BANKING'),
    allowNull: false,
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
}, {
  tableName: 'payments',
  timestamps: false,
});

addAuditHooks(Payment);

module.exports = Payment;
