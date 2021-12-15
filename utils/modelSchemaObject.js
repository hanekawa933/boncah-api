const { DataTypes } = require("sequelize");

const typeData = (types, allowing, range, d, m) => {
  if (types === "decimal") {
    return {
      type: DataTypes[types.toUpperCase()](d, m),
      allowNull: allowing,
    };
  } else {
    return {
      type: DataTypes[types.toUpperCase()](range),
      allowNull: allowing,
    };
  }
};

module.exports = typeData;
