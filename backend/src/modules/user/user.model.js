const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { auditFields, addAuditHooks } = require('../../shared/utils/audit');

const User = sequelize.define('User', {
  ...auditFields,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true, // Optional for senior citizens
    validate: {
      isEmail: {
        msg: 'Invalid email format',
      },
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false, // Primary identifier
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null if using OTP only initially
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: false, // Using custom audit fields
});

addAuditHooks(User);

module.exports = User;
