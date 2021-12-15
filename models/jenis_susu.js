const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Jenis_Susu = db.define("jenis_susu", {
  jenis_susu: typeData("string", false, 50),
});

module.exports = Jenis_Susu;
