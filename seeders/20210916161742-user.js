"use strict";
const bcrypt = require("bcryptjs");

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
    const password = "password123";
    const salt = await bcrypt.genSalt(12);
    const encrypted = await bcrypt.hash(password, salt);
    return await queryInterface.bulkInsert("user", [
      {
        username: "admin",
        password: encrypted,
        nama_lengkap: "Administrator",
        is_admin: 1,
      },
      {
        username: "bukan_admin",
        password: encrypted,
        nama_lengkap: "Pencatat",
        is_admin: 2,
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
    return queryInterface.bulkDelete("user", null, {});
  },
};
