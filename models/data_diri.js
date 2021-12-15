const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Data_Diri = db.define("data_diri", {
  nama_lengkap: typeData("string", false, 75),
  alamat: typeData("string", false, 255),
  pekerjaan: typeData("string", false, 50),
  tempat: typeData("string", false, 75),
  tanggal_lahir: typeData("date", false),
  agama_id: typeData("integer", false),
});

module.exports = Data_Diri;
