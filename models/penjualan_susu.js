const { db } = require("../db/connection");
const {
  notNullInteger,
  notNullDecimal,
} = require("../utils/dbMigrationObject");
const typeData = require("../utils/modelSchemaObject");

const Penjualan_Susu = db.define("penjualan_susu", {
  jenis_susu_id: typeData("integer", false),
  jumlah_terjual_paket: notNullInteger("integer", false),
  jumlah_terjual_liter: typeData("decimal", false, 12, 3),
  hasil_penjualan: typeData("decimal", false, 15),
  tanggal: typeData("date", false),
  jenis_susu_id: typeData("integer", false),
});

module.exports = Penjualan_Susu;
