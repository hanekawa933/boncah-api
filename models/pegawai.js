const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Pegawai = db.define("pegawai", {
  username: typeData("string", false, 16),
  email: typeData("string", false, 255),
  password: typeData("string", false, 255),
  no_telp: typeData("string", false, 15),
  status: typeData("string", false, 15),
  job_id: typeData("integer", false),
  data_diri_id: typeData("integer", false),
});

module.exports = Pegawai;
