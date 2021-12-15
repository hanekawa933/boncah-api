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
    return await queryInterface.bulkInsert("kategori_pengeluaran", [
      {
        kategori: "Persediaan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Makanan dan Minuman",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Transportasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Sewa dan Utilitas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Pengemasan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Gaji Staff",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Tabungan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        kategori: "Pinjaman",
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
    return queryInterface.bulkDelete("kategori_pengeluaran", null, {});
  },
};
