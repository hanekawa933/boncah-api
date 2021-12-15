const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Kategori_Pengeluaran = db.define("kategori_pengeluaran", {
  kategori: typeData("string", false, 50),
});

module.exports = Kategori_Pengeluaran;
