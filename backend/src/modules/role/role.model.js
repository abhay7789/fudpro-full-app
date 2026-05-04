const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['SUPER_ADMIN', 'ADMIN', 'VENDOR', 'USER']]
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true,
});

module.exports = Role;
