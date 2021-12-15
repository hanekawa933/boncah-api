const { db } = require("../db/connection");
const { notNullString } = require("../utils/dbMigrationObject");
const typeData = require("../utils/modelSchemaObject");

const Kambing = db.define("kambing", {
  no_kambing: typeData("string", false, 255),
  foto: typeData("string", false, 255),
  kandang_kambing_id: typeData("integer", false),
  jenis_kambing_id: typeData("integer", false),
  status_kambing_id: typeData("integer", false),
});

module.exports = Kambing;
