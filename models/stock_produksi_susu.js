const { db } = require("../db/connection");
const {
  notNullDecimal,
  notNullInteger,
} = require("../utils/dbMigrationObject");
const typeData = require("../utils/modelSchemaObject");

const Stock_Produksi_Susu = db.define("stock_produksi_susu", {
  jumlah_liter: typeData("decimal", false, 12, 3),
  jumlah_paket: typeData("integer", false),
  jenis_susu_id: typeData("integer", false),
});

module.exports = Stock_Produksi_Susu;
