const { Sequelize } = require("sequelize");

const dbConf = require("../config/config.json")["development"];
const options = {
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: function (field, next) {
      // for reading from database
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
};

const config = Object.assign(dbConf, options);
const db = new Sequelize(config);

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
