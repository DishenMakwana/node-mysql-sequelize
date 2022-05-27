'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(async () => {
        await queryInterface.bulkDelete('roles', null, {
          truncate: true,
        });
      })
      .catch((err) => {
        console.error('unable to delete ', err.message);
      });

    await queryInterface.bulkInsert(
      'roles',
      [
        { id: 1, name: 'SuperAdmin', slug: 'superadmin' },
        { id: 2, name: 'Admin', slug: 'admin' },
        { id: 3, name: 'User', slug: 'user' },
      ],
      {}
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
