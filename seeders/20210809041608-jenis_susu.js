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
    return await queryInterface.bulkInsert("jenis_susu", [
      {
        jenis_susu: "Original",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu: "Coklat",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu: "Strawberry",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_susu: "Vanilla",
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
    return queryInterface.bulkDelete("jenis_susu", null, {});
  },
};
