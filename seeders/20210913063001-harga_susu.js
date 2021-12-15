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

    return await queryInterface.bulkInsert("harga_susu", [
      {
        jenis_susu_id: 1,
        harga: 6500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu_id: 2,
        harga: 6500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu_id: 3,
        harga: 6500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu_id: 4,
        harga: 6500,
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

    return queryInterface.bulkDelete("harga_susu", null, {});
  },
};
