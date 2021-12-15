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

    return await queryInterface.bulkInsert("agama", [
      {
        agama: "Islam",
      },
      {
        agama: "Katolik",
      },
      {
        agama: "Protestan",
      },
      {
        agama: "Buddha",
      },
      {
        agama: "Konghucu",
      },
      {
        agama: "Hindu",
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

    return queryInterface.bulkDelete("agama", null, {});
  },
};
