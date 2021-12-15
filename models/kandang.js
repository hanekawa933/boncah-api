const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Kandang = db.define("kandang", {
  kandang: typeData("string", false, 30),
});

module.exports = Kandang;
