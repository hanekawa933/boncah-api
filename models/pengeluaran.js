const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Pengeluaran = db.define("pengeluaran", {
  pengeluaran: typeData("decimal", false, 15, 2),
  pesan: typeData("text", false),
  tanggal: typeData("date", false),
  kategori_pengeluaran_id: typeData("integer", false),
});

module.exports = Pengeluaran;
