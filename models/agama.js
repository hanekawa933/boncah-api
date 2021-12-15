const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Agama = db.define("agama", {
  agama: typeData("string", false, 20),
});

module.exports = Agama;
