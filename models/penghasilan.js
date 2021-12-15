const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Penghasilan = db.define("penghasilan", {
  kas_penghasilan: typeData("decimal", false, 15, 2),
});

module.exports = Penghasilan;
