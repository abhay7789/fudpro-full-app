const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Delivery = sequelize.define('Delivery', {
  ...auditFields,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  dabbawalaId: {
    type: DataTypes.UUID,
    allowNull: true, // Can be assigned later
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'FAILED'),
    defaultValue: 'PENDING',
  }
}, {
  tableName: 'deliveries',
  timestamps: false,
});

addAuditHooks(Delivery);

module.exports = Delivery;
