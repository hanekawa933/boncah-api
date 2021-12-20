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
        queryInterface.createTable("user", {
          id: primaryKey(),
          username: notNullString(20),
          password: notNullString(255),
          nama_lengkap: notNullString(255),
          is_admin: notNullInteger(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("agama", {
          id: primaryKey(),
          agama: notNullString(20),
        }),

        queryInterface.createTable("job", {
          id: primaryKey(),
          job: notNullString(150),
        }),

        queryInterface.createTable("jenis_susu", {
          id: primaryKey(),
          jenis_susu: notNullString(50),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("jenis_kambing", {
          id: primaryKey(),
          jenis_kambing: notNullString(75),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("status_kambing", {
          id: primaryKey(),
          status: notNullString(75),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("penghasilan", {
          id: primaryKey(),
          kas_penghasilan: notNullDecimal(15, 2),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("penghasilan_harian", {
          id: primaryKey(),
          terjual: notNullInteger(),
          total: notNullDecimal(15, 2),
          tanggal: notNullDate(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("produksi_pupuk", {
          id: primaryKey(),
          jumlah_karung: notNullInteger(),
          tanggal: notNullDate(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("stock_pupuk", {
          id: primaryKey(),
          jumlah_karung: notNullInteger(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("kategori_pengeluaran", {
          id: primaryKey(),
          kategori: notNullString(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("harga_pupuk", {
          id: primaryKey(),
          harga_per_karung: notNullDecimal(15, 2),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("waktu_pemerahan", {
          id: primaryKey(),
          waktu: notNullString("20"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("keterangan_pemerahan", {
          id: primaryKey(),
          keterangan: notNullText(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("kandang", {
          id: primaryKey(),
          kandang: notNullString(30),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = [
      "agama",
      "job",
      "jenis_susu",
      "jenis_kambing",
      "status_kambing",
      "penghasilan",
      "penghasilan_harian",
      "produksi_pupuk",
      "stock_pupuk",
      "kategori_pengeluaran",
      "harga_pupuk",
      "pengeluaran",
      "waktu_pemerahan",
      "keterangan_pemerahan",
      "kandang",
      "user",
    ];

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
