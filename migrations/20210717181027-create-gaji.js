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
      return await queryInterface.createTable("gaji", {
        id: primaryKey(),
        gaji: notNullDecimal(15, 2),
        lembur: notNullDecimal(15, 2),
        total: notNullDecimal(15, 2),
        keterangan: notNullText(),
        pegawai_id: foreignKey("pegawai"),
        pinjaman_bulanan_id: foreignKey("pinjaman_bulanan"),
        tanggal: notNullDate(),
        createdAt: notNullDate(),
        updatedAt: notNullDate(),
      });
    } catch (error) {
      console.log(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.dropTable("gaji");
    } catch (error) {
      console.log(error);
    }
  },
};
