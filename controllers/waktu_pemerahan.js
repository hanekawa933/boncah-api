const { Waktu_Pemerahan } = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const getWaktuPemerahan = async (req, res, next) => {
  try {
    const waktu = await Waktu_Pemerahan.findAll();

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data pemerahan",
      data: waktu,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWaktuPemerahan,
};
