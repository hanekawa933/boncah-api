const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const User = db.define("user", {
  username: typeData("string", false, 16),
  password: typeData("string", false, 255),
});

module.exports = User;
