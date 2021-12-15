const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Catatan_Kambing = db.define("catatan_kambing", {
  sakit: typeData("integer", false),
  sehat: typeData("integer", false),
  meninggal: typeData("integer", false),
  jenis_kambing_id: typeData("integer", false),
  tanggal: typeData("date", false),
});

module.exports = Catatan_Kambing;
