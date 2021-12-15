const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Keterangan_Pemerahan = db.define("keterangan_pemerahan", {
  keterangan: typeData("string", false),
});

module.exports = Keterangan_Pemerahan;
