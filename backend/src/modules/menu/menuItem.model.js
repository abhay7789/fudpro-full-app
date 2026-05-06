const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const MenuItem = sequelize.define('MenuItem', {
  ...auditFields,
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true,
  }
}, {
  tableName: 'menu_items',
  timestamps: false,
});

addAuditHooks(MenuItem);

module.exports = MenuItem;
