const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Waktu_Pemerahan = db.define("waktu_pemerahan", {
  waktu: typeData("string", false, 20),
});

module.exports = Waktu_Pemerahan;
