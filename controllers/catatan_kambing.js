const {
  Harga_Susu,
  Jenis_Susu,
  Kambing,
  Pegawai,
  Pengeluaran,
  Penghasilan,
  Penjualan,
  Stock_Susu_Olahan,
  Stock_Susu,
  Susu_Olahan,
  Susu_Original,
  Catatan_Kambing,
} = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postCatatanKambing = async (req, res, next) => {
  const { sakit, sehat, meninggal, jenis_kambing_id, tanggal } = req.body;
  try {
    const data = await Catatan_Kambing.create({
      sakit,
      sehat,
      meninggal,
      jenis_kambing_id,
      tanggal,
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully post data catatan kambing",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCatatanKambing = async (req, res, next) => {
  try {
    const data = await Catatan_Kambing.findAll();

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data catatan kambing",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCatatanKambingById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Catatan_Kambing.findOne({ id });

    if (data) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data catatan kambing",
        data,
      });
    } else {
      res.status(404);
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postCatatanKambing,
  getAllCatatanKambing,
  getCatatanKambingById,
};
