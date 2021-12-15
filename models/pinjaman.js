const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Pinjaman = db.define("pinjaman", {
  tanggal_peminjaman: typeData("date", false),
  pinjaman: typeData("decimal", false, 15, 2),
  keterangan: typeData("text", false),
  pegawai_id: typeData("integer", false),
});

module.exports = Pinjaman;
