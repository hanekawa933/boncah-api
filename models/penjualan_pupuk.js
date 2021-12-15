const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Penjualan_Pupuk = db.define("penjualan_pupuk", {
  jumlah_terjual: typeData("integer", false),
  hasil_penjualan: typeData("decimal", false, 12, 3),
  tanggal: typeData("date", false),
});

module.exports = Penjualan_Pupuk;
