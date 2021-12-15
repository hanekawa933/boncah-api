const { db } = require("../db/connection");
const { notNullInteger } = require("../utils/dbMigrationObject");
const typeData = require("../utils/modelSchemaObject");

const Stock_Pupuk = db.define("stock_pupuk", {
  jumlah_karung: typeData("integer", false),
});

module.exports = Stock_Pupuk;
