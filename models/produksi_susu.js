const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Produksi_Susu = db.define("produksi_susu", {
  jumlah_paket: typeData("integer", false),
  jumlah_liter: typeData("decimal", false, 12, 3),
  tanggal: typeData("date", false),
  jenis_susu_id: typeData("integer", false),
});

module.exports = Produksi_Susu;
