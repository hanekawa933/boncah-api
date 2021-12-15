const { Kandang, Kandang_Kambing } = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postKandangKambing = async (req, res, next) => {
  const { kandang } = req.body;

  try {
    const nama = await Kandang.create({
      kandang,
    });
    const data = await Kandang_Kambing.create({
      jumlah_kambing: 0,
      betina: 0,
      jantan: 0,
      anakan: 0,
      kandang_id: nama.id,
      status_kambing_id: 1,
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully post kandang kambing",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getSumOfKambing = async (req, res, next) => {
  try {
    const data = await Kandang_Kambing.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("jumlah_kambing")),
          "jumlah_kambing",
        ],
        [sequelize.fn("SUM", sequelize.col("betina")), "betina"],
        [sequelize.fn("SUM", sequelize.col("jantan")), "jantan"],
        [sequelize.fn("SUM", sequelize.col("anakan")), "anakan"],
      ],
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data kambing",
      data: data[0],
    });
  } catch (error) {
    next(error);
  }
};

const getAllKandangKambing = async (req, res, next) => {
  try {
    const data = await Kandang_Kambing.findAll();
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get kandang kambing",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getKandangKambingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Kandang_Kambing.findOne({
      where: { id },
    });

    if (data) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get kandang kambing",
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
  postKandangKambing,
  getAllKandangKambing,
  getKandangKambingById,
  getSumOfKambing,
};
