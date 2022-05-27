const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var Permission = sequelize.define(
  'permissions',
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
    },
    group: {
      type: Sequelize.STRING,
      field: 'group',
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
module.exports = Permission;
