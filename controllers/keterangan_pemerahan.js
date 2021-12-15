const { Keterangan_Pemerahan } = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const getDataKeterangan = async (req, res, next) => {
  try {
    const keterangan = await Keterangan_Pemerahan.findAll({ limit: 2 });

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data pemerahan",
      data: keterangan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDataKeterangan,
};
