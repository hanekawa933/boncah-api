"use strict";
const {
  primaryKey,
  notNullString,
  nullableString,
  notNullInteger,
  notNullDecimal,
  nullableInteger,
  notNullDate,
  notNullText,
  PKCascade,
  foreignKey,
} = require("../utils/dbMigrationObject");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return (
        await queryInterface.createTable("pinjaman", {
          id: primaryKey(),
          tanggal_peminjaman: notNullDate(),
          keterangan: notNullText(),
          pinjaman: notNullDecimal(15, 2),
          pegawai_id: foreignKey("pegawai"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),
        queryInterface.createTable("pinjaman_bulanan", {
          id: primaryKey(),
          total: notNullDecimal(15, 2),
          bulan: notNullDate(),
          pegawai_id: foreignKey("pegawai"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        })
      );
    } catch (error) {
      console.log(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = ["pinjaman", "pinjaman_bulanan"];

    try {
      return await Promise.all([
        table.forEach((item) => {
          queryInterface.dropTable(item);
        }),
      ]);
    } catch (error) {
      console.log(error);
    }
  },
};
