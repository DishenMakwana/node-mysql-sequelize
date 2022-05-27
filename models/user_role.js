const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var UserRole = sequelize.define(
  'users_roles',
  {
    role_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
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

module.exports = UserRole;
