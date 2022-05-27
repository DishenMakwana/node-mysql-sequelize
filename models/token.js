const Sequelize = require('sequelize');
const sequelize = require('../config/db');

var Token = sequelize.define(
  'tokens',
  {
    user_id: {
      type: Sequelize.INTEGER,
      field: 'user_id',
    },
    token: {
      type: Sequelize.STRING,
      field: 'token',
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

module.exports = Token;
