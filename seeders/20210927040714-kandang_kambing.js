"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert("status_kambing", [
      {
        status: "Sehat",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: "Sakit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: "Perawatan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("kandang_kambing", null, {});
  },
};
