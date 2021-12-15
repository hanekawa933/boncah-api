const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Kandang_Kambing = db.define("kandang_kambing", {
  jumlah_kambing: typeData("integer", false),
  betina: typeData("integer", false),
  jantan: typeData("integer", false),
  anakan: typeData("integer", false),
  kandang_id: typeData("integer", false),
  status_kambing_id: typeData("integer", false),
});

module.exports = Kandang_Kambing;
