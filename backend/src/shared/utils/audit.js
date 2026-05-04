const { DataTypes } = require('sequelize');

const auditFields = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  created_at_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  created_at_time: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW,
  },
  created_at_datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  updated_at_time: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW,
  },
  updated_at_datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const addAuditHooks = (Model) => {
  Model.beforeCreate((instance) => {
    const now = new Date();
    instance.created_at_date = now;
    instance.created_at_time = now.toTimeString().split(' ')[0];
    instance.created_at_datetime = now;
    instance.updated_at_date = now;
    instance.updated_at_time = now.toTimeString().split(' ')[0];
    instance.updated_at_datetime = now;
  });

  Model.beforeUpdate((instance) => {
    const now = new Date();
    instance.updated_at_date = now;
    instance.updated_at_time = now.toTimeString().split(' ')[0];
    instance.updated_at_datetime = now;
  });
};

module.exports = { auditFields, addAuditHooks };
