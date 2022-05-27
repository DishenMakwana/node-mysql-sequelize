const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var User = sequelize.define(
  'users',
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
    },
    password: {
      type: Sequelize.STRING,
      field: 'password',
    },
    mobile: {
      type: Sequelize.STRING,
      field: 'mobile',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updatedAt',
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = User;
