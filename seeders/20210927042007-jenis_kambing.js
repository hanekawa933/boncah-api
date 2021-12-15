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
    return await queryInterface.bulkInsert("jenis_kambing", [
      {
        jenis_kambing: "Betina",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_kambing: "Jantan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        jenis_kambing: "Anakan",
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
    return queryInterface.bulkDelete("jenis_kambing", null, {});
  },
};
