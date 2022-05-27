'use strict';

const { role } = require('../utils/constant');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users_roles', { id: 1 }, {});
    await queryInterface.bulkInsert(
      'users_roles',
      [{ id: 1, role_id: role.SUPERADMIN, user_id: 1 }],
      {}
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users_roles', null, {});
  },
};
