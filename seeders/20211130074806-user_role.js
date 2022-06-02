'use strict';

const { role } = require('../utils/constant');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users_roles', { id: 1 }, {});
    await queryInterface.bulkInsert(
      'users_roles',
      [
        { id: 1, role_id: role.SUPERADMIN, user_id: 1 },
        { id: 2, role_id: role.USER, user_id: 2 },
        { id: 3, role_id: role.ADMIN, user_id: 3 },
        { id: 4, role_id: role.ADMIN, user_id: 4 },
        { id: 5, role_id: role.USER, user_id: 5 },
        { id: 6, role_id: role.USER, user_id: 6 },
      ],
      {}
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users_roles', null, {});
  },
};
