const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Jenis_Kambing = db.define("jenis_kambing", {
  jenis_kambing: typeData("string", false, 75),
});

module.exports = Jenis_Kambing;
