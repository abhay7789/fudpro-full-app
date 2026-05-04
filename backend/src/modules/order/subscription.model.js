const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Subscription = sequelize.define('Subscription', {
  ...auditFields,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  planType: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY'),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'subscriptions',
  timestamps: false,
});

addAuditHooks(Subscription);

module.exports = Subscription;
