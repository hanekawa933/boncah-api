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

    return await queryInterface.bulkInsert("job", [
      {
        job: "Dirut",
      },
      {
        job: "Penjaga Kambing",
      },
      {
        job: "Sekretaris",
      },
      {
        job: "Bendahara",
      },
      {
        job: "Tim Medis",
      },
      {
        job: "Reparasi",
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

    return queryInterface.bulkDelete("job", null, {});
  },
};
