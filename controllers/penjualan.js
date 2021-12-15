const { Penghasilan, Penghasilan_Harian } = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postPenjualanSusu = async (req, res, next) => {
  const { jenis_susu_id, tanggal, hasil_terjual, liter_terjual } = req.body;

  try {
    // logic
    // Penjualan => dicek dulu yang terjual apa-> berarti update stock susu sesuai susu_id,
    // terus dicek lagi penghasilan udah ada apa belom-> kalo udah ada update, kalo belom ada ya create, terus dicek lagi
    // susu yang terjual lebih ga dari yang ada di stock.

    const jenisSusu = await Jenis_Susu.findOne({
      where: { id: jenis_susu_id },
    });
    if (jenisSusu.jenis_susu === "Original") {
      const getCurrentStock = await Stock_Susu.findOne({
        where: { id: jenis_susu_id },
      });
      const parsedCurrentStock = parseFloat(getCurrentStock.jumlah_liter);
      const parsedLiterTerjual = parseFloat(liter_terjual);
      const result = parsedCurrentStock - parsedLiterTerjual;

      if (getCurrentStock && parsedCurrentStock >= parsedLiterTerjual) {
        const updateStock = await Stock_Susu.update({
          jumlah_liter: result.toFixed(3),
        });

        const checkPenghasilan = await Penghasilan.findOne();
        if (checkPenghasilan) {
          const parsedCurrentPenghasilan = parseFloat(
            checkPenghasilan.kas_penghasilan
          );
          const parsedHasilTerjual = parseFloat(hasil_terjual);
          const resultHasil = parsedCurrentPenghasilan + parsedHasilTerjual;
          const updatePenghasilan = await Penghasilan.update(
            {
              kas_penghasilan: resultHasil.toFixed(3),
            },
            { where: { id: checkPenghasilan.id } }
          );
        } else {
          const createPenghasilan = await Penghasilan.create({
            kas_penghasilan: hasil_terjual,
          });
        }

        const penjualan = await Penjualan.create({
          jenis_susu_id,
          tanggal,
          hasil_terjual,
          liter_terjual,
        });

        res.status(200).send({
          statusCode: res.status,
          msg: "Successfully add data penjualan",
          data: penjualan,
        });
      } else {
        res.status(400);
        next(error);
      }
    } else {
      const getCurrentStock = await Stock_Susu_Olahan.findOne({
        where: { id: jenis_susu_id },
      });
      const parsedCurrentStock = parseFloat(getCurrentStock.jumlah_liter);
      const parsedLiterTerjual = parseFloat(liter_terjual);
      const result = parsedCurrentStock - parsedLiterTerjual;

      if (getCurrentStock && parsedCurrentStock >= parsedLiterTerjual) {
        const updateStock = await Stock_Susu_Olahan.update(
          {
            jumlah_liter: result.toFixed(3),
          },
          { where: { jenis_susu_id } }
        );

        const checkPenghasilan = await Penghasilan.findOne();
        if (checkPenghasilan) {
          const parsedCurrentPenghasilan = parseFloat(
            checkPenghasilan.kas_penghasilan
          );
          const parsedHasilTerjual = parseFloat(hasil_terjual);
          const resultHasil = parsedCurrentPenghasilan + parsedHasilTerjual;
          const updatePenghasilan = await Penghasilan.update(
            {
              kas_penghasilan: resultHasil.toFixed(3),
            },
            { where: { id: checkPenghasilan.id } }
          );
        } else {
          const createPenghasilan = await Penghasilan.create({
            kas_penghasilan: hasil_terjual,
          });
        }

        const penjualan = await Penjualan.create({
          jenis_susu_id,
          tanggal,
          hasil_terjual,
          liter_terjual,
        });

        res.status(200).send({
          statusCode: res.status,
          msg: "Successfully add data penjualan",
          data: penjualan,
        });
      } else {
        res.status(400);
        const error = new Error();
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

const getDataPenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [{ model: Jenis_Susu }],
    });

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data penjualan",
      data: penjualan,
    });
  } catch (error) {
    next(error);
  }
};

const getDataPenjualanByMonth = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [{ model: Jenis_Susu }],
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

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data penjualan",
      data: penjualan,
    });
  } catch (error) {
    next(error);
  }
};

const getDataPenjualanByMonthAndJenisSusu = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [{ model: Jenis_Susu }],
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

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data penjualan",
      data: penjualan,
    });
  } catch (error) {
    next(error);
  }
};

const getDataPenjualanByMonthDateAndJenisSusu = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [{ model: Jenis_Susu }],
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

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data penjualan",
      data: penjualan,
    });
  } catch (error) {
    next(error);
  }
};

const getDataPenjualanByMonthAndDate = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [{ model: Jenis_Susu }],
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

    res.status(200).send({
      statusCode: res.status,
      msg: "Successfully get data penjualan",
      data: penjualan,
    });
  } catch (error) {
    next(error);
  }
};

const getPenjualanUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Penghasilan_Harian.sum("terjual", {
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            getMonth + 1
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            getYear
          ),
        ],
      },
      dataType: "integer",
    });

    const data2 = await Penghasilan_Harian.sum("total", {
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            getMonth + 1
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            getYear
          ),
        ],
      },
      dataType: "decimal(12,3)",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data penjualan susu",
      data,
      data2,
    });
  } catch (error) {
    next(error);
  }
};

const getTotalPenjualanSumBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Penghasilan_Harian.sum("terjual", {
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
      });

      const data2 = await Penghasilan_Harian.sum("total", {
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
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan",
        data,
        data2,
      });
    } else if (search === "prev_month") {
      const data = await Penghasilan_Harian.sum("terjual", {
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
      });

      const data2 = await Penghasilan_Harian.sum("total", {
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
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan",
        data,
        data2,
      });
    } else if (search === "today") {
      const data = await Penghasilan_Harian.sum("terjual", {
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
      });

      const data2 = await Penghasilan_Harian.sum("total", {
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
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan",
        data: isNaN(data) ? 0 : data,
        data2: isNaN(data2) ? 0 : data2,
      });
    } else if (search === "this_week") {
      const data = await Penghasilan_Harian.sum("terjual", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });

      const data2 = await Penghasilan_Harian.sum("total", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan",
        data,
        data2,
      });
    } else if (search === "custom") {
      if (year === undefined && month === undefined && date === undefined) {
        res.status(404);
        next();
      } else if (
        year !== undefined &&
        month !== undefined &&
        date === undefined
      ) {
        const data = await Penghasilan_Harian.sum("terjual", {
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
            ],
          },
        });

        const data2 = await Penghasilan_Harian.sum("total", {
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
            ],
          },
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data penjualan",
          data,
          data2,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data = await Penghasilan_Harian.sum("terjual", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });

        const data2 = await Penghasilan_Harian.sum("total", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data penjualan",
          data,
          data2,
        });
      } else {
        const data = await Penghasilan_Harian.sum("terjual", {
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
        });

        const data2 = await Penghasilan_Harian.sum("total", {
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
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data penjualan",
          data,
          data2,
        });
      }
    } else if (search === "all") {
      const data = await Penghasilan_Harian.sum("terjual");
      const data2 = await Penghasilan_Harian.sum("total");

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan",
        data,
        data2,
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
  postPenjualanSusu,
  getDataPenjualan,
  getDataPenjualanByMonth,
  getDataPenjualanByMonthAndJenisSusu,
  getDataPenjualanByMonthDateAndJenisSusu,
  getDataPenjualanByMonthAndDate,
  getPenjualanUntillToday,
  getTotalPenjualanSumBasedOnQuery,
};
