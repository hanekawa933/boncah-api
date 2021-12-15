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
        queryInterface.createTable("produksi_susu", {
          id: primaryKey(),
          jumlah_paket: notNullInteger(),
          jumlah_liter: notNullDecimal(12, 3),
          tanggal: notNullDate(),
          jenis_susu_id: foreignKey("jenis_susu"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("hasil_perahan", {
          id: primaryKey(),
          hasil_perahan: notNullDecimal(12, 3),
          hasil_berkurang: notNullDecimal(12, 3),
          total_perahan: notNullDecimal(12, 3),
          keterangan_pemerahan_id: foreignKey("keterangan_pemerahan"),
          tanggal: notNullDate(),
          waktu_pemerahan_id: foreignKey("waktu_pemerahan"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("pengeluaran", {
          id: primaryKey(),
          pengeluaran: notNullDecimal(15, 2),
          pesan: notNullText(),
          kategori_pengeluaran_id: foreignKey("kategori_pengeluaran"),
          tanggal: notNullDate(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),
        // queryInterface.createTable("catatan_kambing", {
        //   id: primaryKey(),
        //   sakit: notNullInteger(),
        //   sehat: notNullInteger(),
        //   meninggal: notNullInteger(),
        //   jenis_kambing_id: foreignKey("jenis_kambing"),
        //   tanggal: notNullDate(),
        //   createdAt: notNullDate(),
        //   updatedAt: notNullDate(),
        // }),

        queryInterface.createTable("kandang_kambing", {
          id: primaryKey(),
          jumlah_kambing: notNullInteger(),
          betina: notNullInteger(),
          jantan: notNullInteger(),
          anakan: notNullInteger(),
          kandang_id: foreignKey("kandang"),
          status_kambing_id: foreignKey("status_kambing"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("harga_susu", {
          id: primaryKey(),
          jenis_susu_id: foreignKey("jenis_susu"),
          harga: notNullDecimal(15, 3),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("penjualan_susu", {
          id: primaryKey(),
          jenis_susu_id: foreignKey("jenis_susu"),
          jumlah_terjual_paket: notNullInteger(),
          jumlah_terjual_liter: notNullDecimal(12, 3),
          hasil_penjualan: notNullDecimal(15, 2),
          tanggal: notNullDate(),
          jenis_susu_id: foreignKey("jenis_susu"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("penjualan_pupuk", {
          id: primaryKey(),
          jumlah_terjual: notNullInteger(),
          hasil_penjualan: notNullDecimal(15, 2),
          tanggal: notNullDate(),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("stock_produksi_susu", {
          id: primaryKey(),
          jumlah_liter: notNullDecimal(12, 3),
          jumlah_paket: notNullInteger(),
          jenis_susu_id: foreignKey("jenis_susu"),
          createdAt: notNullDate(),
          updatedAt: notNullDate(),
        }),

        queryInterface.createTable("data_diri", {
          id: primaryKey(),
          nama_lengkap: notNullString(75),
          alamat: notNullString(255),
          pekerjaan: notNullString(50),
          tempat: notNullString(50),
          tanggal_lahir: notNullDate(),
          agama_id: foreignKey("agama"),
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
      "produksi_susu",
      "hasil_perahan",
      "kandang_kambing",
      "harga_susu",
      "penjualan_susu",
      "penjualan_pupuk",
      "stock_produksi_susu",
      "data_diri",
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
