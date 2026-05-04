const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const Vendor = sequelize.define('Vendor', {
  ...auditFields,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One User -> One Vendor
  },
  restaurantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  startTime: {
    type: DataTypes.TIME,
    defaultValue: '08:00:00',
  },
  endTime: {
    type: DataTypes.TIME,
    defaultValue: '22:00:00',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coverImage: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'vendors',
  timestamps: false,
});

addAuditHooks(Vendor);

module.exports = Vendor;
