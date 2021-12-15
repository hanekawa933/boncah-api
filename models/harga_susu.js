const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Harga_Susu = db.define("harga_susu", {
  jenis_susu_id: typeData("integer", false),
  harga: typeData("decimal", false, 15, 2),
});

module.exports = Harga_Susu;
