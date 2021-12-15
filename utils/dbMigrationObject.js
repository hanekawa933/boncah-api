const Sequelize = require("sequelize");

const primaryKey = () => {
  return {
    allowNull: false,
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  };
};
const notNullString = (range) => {
  return {
    allowNull: false,
    type: Sequelize.STRING(range),
  };
};

const nullableString = (range) => {
  return {
    allowNull: true,
    type: Sequelize.STRING(range),
  };
};

const notNullInteger = () => {
  return {
    allowNull: false,
    type: Sequelize.INTEGER,
  };
};

const nullableInteger = () => {
  return {
    allowNull: false,
    type: Sequelize.INTEGER,
  };
};

const notNullDate = () => {
  return {
    allowNull: false,
    type: Sequelize.DATE,
  };
};

const notNullDecimal = (m, d) => {
  return {
    allowNull: false,
    type: Sequelize.DECIMAL(m, d),
  };
};

const notNullText = () => {
  return {
    allowNull: false,
    type: Sequelize.TEXT,
  };
};

const PKCascade = () => {
  return {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
    onDelete: "CASCADE",
  };
};

const foreignKey = (tableReferenced) => {
  return {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: { model: tableReferenced, key: "id" },
    foreignKey: "id",
    onDelete: "CASCADE",
  };
};

module.exports = {
  primaryKey,
  notNullString,
  nullableString,
  notNullInteger,
  notNullDecimal,
  nullableInteger,
  notNullDate,
  notNullText,
  PKCascade,
  foreignKey,
};
