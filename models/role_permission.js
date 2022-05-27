const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var Role_Permission = sequelize.define(
  'role_permission',
  {
    role_id: {
      type: Sequelize.INTEGER,
      field: 'role_id',
    },
    permission_id: {
      type: Sequelize.INTEGER,
      field: 'permission_id',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updatedAt',
    },
  },
  {
    freezeTableName: true,
  }
);
module.exports = Role_Permission;
