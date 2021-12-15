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
      return await Promise.all([
        queryInterface.createTable("pegawai", {
          id: primaryKey(),
          username: notNullString(16),
          email: notNullString(255),
          password: notNullString(255),
          no_telp: notNullString(15),
          status: notNullString(15),
          job_id: foreignKey("job"),
          data_diri_id: foreignKey("data_diri"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("kambing", {
          id: primaryKey(),
          no_kambing: notNullString(255),
          foto: notNullString(),
          kandang_kambing_id: foreignKey("kandang_kambing"),
          jenis_kambing_id: foreignKey("jenis_kambing"),
          status_kambing_id: foreignKey("status_kambing"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      return await Promise.all([
        queryInterface.dropTable("pegawai"),
        queryInterface.dropTable("kambing"),
      ]);
    } catch (error) {
      console.log(error);
    }
  },
};
