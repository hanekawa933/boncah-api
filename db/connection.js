const { Sequelize } = require("sequelize");
const dbConf = require("../config/config.json")["development"];

// const options = {
//   define: {
//     freezeTableName: true,
//   },
//   dialectOptions: {
//     dateStrings: true,
//     typeCast: function (field, next) {
//       // for reading from database
//       if (field.type === "DATETIME") {
//         return field.string();
//       }
//       return next();
//     },
//   },
// };

const db = new Sequelize(
  "n1007420_boncah",
  "n1007420_erorsetneg",
  "@Thisiserorsetnegcpanelpassword999",
  {
    host: "erorsetneg.com",
    dialect: "mysql",
  }
);

const connection = () => {
  try {
    db.authenticate();
    console.log("Connected to the database...");
  } catch (error) {
    console.log("Unnable to connect to the database...");
  }
};

module.exports = {
  db,
  connection,
};
