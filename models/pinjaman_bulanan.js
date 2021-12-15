const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Pinjaman_Bulanan = db.define("pinjaman_bulanan", {
  total: typeData("decimal", false, 15, 2),
  pegawai_id: typeData("integer", false),
  bulan: typeData("date", false),
});

module.exports = Pinjaman_Bulanan;
