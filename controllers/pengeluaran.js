const { db } = require("../db/connection");
const { Pengeluaran, Kategori_Pengeluaran } = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postPengeluaran = async (req, res, next) => {
  const { pengeluaran, pesan, kategori_pengeluaran_id, tanggal } = req.body;

  try {
    const isOther = await Kategori_Pengeluaran.findOne({
      where: { id: kategori_pengeluaran_id },
    });

    if (isOther) {
      const data = await Pengeluaran.create({
        pengeluaran,
        pesan,
        kategori_pengeluaran_id,
        tanggal,
      });
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Pengeluaran successfully created...",
        data,
      });
    } else {
      const result = await db.transaction(async (t) => {
        const kategori_pengeluaran = await Kategori_Pengeluaran.create({
          kategori: kategori_pengeluaran_id,
        });

        const data = await Pengeluaran.create({
          pengeluaran,
          pesan,
          kategori_pengeluaran_id: kategori_pengeluaran.getDataValue("id"),
          tanggal,
        });
        return { data, kategori_pengeluaran };
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Pengeluaran successfully created...",
        data: result,
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getDataKategori = async (req, res, next) => {
  try {
    const data = await Kategori_Pengeluaran.findAll();
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data kategori",
      data,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getPengeluaranBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Pengeluaran.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              getMonth
            ),
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              getYear
            ),
          ],
        },
        include: {
          model: Kategori_Pengeluaran,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data pengeluaran",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Pengeluaran.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              getMonth - 1
            ),
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              getYear
            ),
          ],
        },
        include: {
          model: Kategori_Pengeluaran,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data pengeluaran",
        data,
      });
    } else if (search === "today") {
      const data = await Pengeluaran.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              getMonth
            ),
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              getYear
            ),
            sequelize.where(
              sequelize.fn("DAY", sequelize.col("tanggal")),
              getDate
            ),
          ],
        },
        include: {
          model: Kategori_Pengeluaran,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data pengeluaran",
        data,
      });
    } else if (search === "this_week") {
      const data = await Pengeluaran.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
        include: { model: Kategori_Pengeluaran },
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data pengeluaran",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Pengeluaran.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("tanggal")),
                month
              ),
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
              sequelize.where(
                sequelize.fn("DAY", sequelize.col("tanggal")),
                date
              ),
            ],
          },
          include: {
            model: Kategori_Pengeluaran,
          },
          order: [["tanggal", "ASC"]],
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data pengeluaran",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Pengeluaran.findAll({
        include: {
          model: Kategori_Pengeluaran,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data pengeluaran",
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
  postPengeluaran,
  getDataKategori,
  getPengeluaranBasedOnQuery,
};
