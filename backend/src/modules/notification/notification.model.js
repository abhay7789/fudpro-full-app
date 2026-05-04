const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Notification = sequelize.define('Notification', {
  ...auditFields,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('EMAIL', 'SMS', 'PUSH'),
    defaultValue: 'PUSH',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'notifications',
  timestamps: false,
});

addAuditHooks(Notification);

module.exports = Notification;
