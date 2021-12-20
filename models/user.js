const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const User = db.define("user", {
  username: typeData("string", false, 16),
  password: typeData("string", false, 255),
  nama_lengkap: typeData("string", false, 255),
  is_admin: typeData("integer", false),
});

module.exports = User;
