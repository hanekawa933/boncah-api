const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Penghasilan_Harian = db.define("penghasilan_harian", {
  terjual: typeData("integer", false),
  total: typeData("decimal", false, 15, 2),
  tanggal: typeData("date", false),
});

module.exports = Penghasilan_Harian;
