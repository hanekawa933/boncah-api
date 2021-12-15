const { db } = require("../db/connection");
const typeData = require("../utils/modelSchemaObject");

const Status_Kambing = db.define("status_kambing", {
  status: typeData("string", false, 75),
});

module.exports = Status_Kambing;
