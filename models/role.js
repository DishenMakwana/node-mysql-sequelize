const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var Role = sequelize.define(
  'roles',
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
    },
    slug: {
      type: Sequelize.STRING,
      field: 'slug',
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

module.exports = Role;
