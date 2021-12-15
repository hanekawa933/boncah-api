const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");
const Pegawai = require("./pegawai");

const Job = db.define("job", {
  job: typeData("string", false, 150),
});

module.exports = Job;
