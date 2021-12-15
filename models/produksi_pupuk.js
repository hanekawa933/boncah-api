const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Produksi_Pupuk = db.define("produksi_pupuk", {
  jumlah_karung: typeData("decimal", false, 12, 3),
  tanggal: typeData("date", false),
});

module.exports = Produksi_Pupuk;
