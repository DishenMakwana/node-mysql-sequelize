'use strict';
const { data } = require('../utils/static_data/permission');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(async () => {
        await queryInterface.bulkDelete('permissions', null, {
          truncate: true,
        });
      })
      .catch((err) => {
        console.log('unable to delete ', err.message);
      });
    await queryInterface.bulkInsert('permissions', [...data], {});
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
