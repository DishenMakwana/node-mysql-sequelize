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
    is_approved: {
      type: Sequelize.BOOLEAN,
      field: 'is_approved',
      defaultValue: false,
    },
    is_blocked: {
      type: Sequelize.BOOLEAN,
      field: 'is_blocked',
      defaultValue: false,
    },
    payment_method: {
      type: Sequelize.ENUM,
      field: 'payment_method',
      values: [0, 1, 2],
      defaultValue: 0,
    },
    gst_number: {
      type: Sequelize.STRING,
      field: 'gst_number',
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
