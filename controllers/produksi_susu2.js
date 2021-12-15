const {
  Jenis_Susu,
  Stock_Susu_Olahan,
  Susu_Olahan,
} = require("../models/model");

const errorMessage = require("../middleware/errorMessage");

const { db } = require("../db/connection");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postSusu = async (req, res, next) => {
  const {
    jenis_susu_id,
    liter_perasan,
    liter_berkurang,
    alasan_berkurang,
    tanggal,
  } = req.body;
  try {
    const stockSusu = await Stock_Susu_Olahan.findOne({
      where: { jenis_susu_id },
    });

    const literPerasan = parseFloat(liter_perasan);
    const literBerkurang = parseFloat(liter_berkurang);
    const total = literPerasan - literBerkurang;

    if (!stockSusu) {
      const result = await db.transaction(async (t) => {
        const data = await Susu_Olahan.create({
          jenis_susu_id,
          liter_perasan,
          liter_berkurang,
          liter_total: total.toFixed(3),
          alasan_berkurang,
          tanggal,
        });

        const stock = await Stock_Susu_Olahan.create({
          jenis_susu_id,
          jumlah_liter: total.toFixed(3),
        });

        return { data, stock };
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Susu Olahan successfully created...",
        data: {
          susu_olahan: result.data,
          stock_susu: result.stock,
        },
      });
    } else {
      const result = await db.transaction(async (t) => {
        const data = await Susu_Olahan.create({
          jenis_susu_id,
          liter_perasan,
          liter_berkurang,
          liter_total: total.toFixed(3),
          alasan_berkurang,
          tanggal,
        });

        const liter_total = await Susu_Olahan.sum("liter_total", {
          where: { jenis_susu_id },
        });

        const stock = await Stock_Susu_Olahan.update(
          {
            jumlah_liter: liter_total,
          },
          { where: { jenis_susu_id } }
        );

        return data;
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Susu Olahan Successfully added...",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllSusu = async (req, res, next) => {
  try {
    const data = await Susu_Olahan.findAll();
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data susu olahan...",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSusuBasedOnMonth = async (req, res, next) => {
  try {
    const data = await Susu_Olahan.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            req.params.bulan
          ),
        ],
      },
    });

    if (data.length === 0) {
      res.status(404);
      next();
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get susu original data...",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllSusuBasedOnDateAndMonth = async (req, res, next) => {
  try {
    const data = await Susu_Olahan.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            req.params.bulan
          ),
          sequelize.where(
            sequelize.fn("DAY", sequelize.col("tanggal")),
            req.params.tanggal
          ),
        ],
      },
    });

    if (data.length === 0) {
      res.status(404);
      next();
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get susu original data...",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllSusuBasedOnMonthAndJenisSusu = async (req, res, next) => {
  try {
    const data = await Susu_Olahan.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            req.params.bulan
          ),
          { jenis_susu_id: req.params.jenis_susu },
        ],
      },
    });

    if (!data) {
      res.status(404);
      next();
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get susu original data...",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllSusuBasedOnDateMonthAndJenisSusu = async (req, res, next) => {
  try {
    const data = await Susu_Olahan.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            req.params.bulan
          ),
          sequelize.where(
            sequelize.fn("DAY", sequelize.col("tanggal")),
            req.params.tanggal
          ),
          { jenis_susu_id: req.params.jenis_susu },
        ],
      },
    });

    if (!data) {
      res.status(404);
      next();
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get susu original data...",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postSusu,
  getAllSusu,
  getAllSusuBasedOnMonth,
  getAllSusuBasedOnDateAndMonth,
  getAllSusuBasedOnMonthAndJenisSusu,
  getAllSusuBasedOnDateMonthAndJenisSusu,
};
