const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Hasil_Perahan = db.define("hasil_perahan", {
  hasil_perahan: typeData("decimal", false, 12, 3),
  hasil_berkurang: typeData("decimal", false, 12, 3),
  total_perahan: typeData("decimal", false, 12, 3),
  keterangan_pemerahan_id: typeData("integer", false),
  tanggal: typeData("date", false),
  waktu_pemerahan_id: typeData("integer", false),
});

module.exports = Hasil_Perahan;
