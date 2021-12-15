const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Gaji = db.define("gaji", {
  gaji: typeData("decimal", false, 15, 2),
  lembur: typeData("decimal", false, 15, 2),
  total: typeData("decimal", false, 15, 2),
  tanggal: typeData("date", false),
  keterangan: typeData("text", false),
  pegawai_id: typeData("integer", false),
  pinjaman_bulanan_id: typeData("integer", false),
});

module.exports = Gaji;
