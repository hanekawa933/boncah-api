const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Harga_Pupuk = db.define("harga_pupuk", {
  harga_per_karung: typeData("decimal", false, 12, 3),
});

module.exports = Harga_Pupuk;
