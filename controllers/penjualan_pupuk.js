const {
  Penghasilan,
  Penjualan_Pupuk,
  Penghasilan_Harian,
  Pengeluaran,
  Penjualan_Susu,
} = require("../models/model");

const { db } = require("../db/connection");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postPenjualanPupuk = async (req, res, next) => {
  const { jumlah_terjual, hasil_penjualan, tanggal } = req.body;
  const date = new Date(tanggal);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dates = date.getDate();
  try {
    const isIncomeExists = await Penghasilan.findOne();
    const isDailyIncomeExists = await Penghasilan_Harian.findOne({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn("YEAR", sequelize.col("tanggal")), year),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            month
          ),
          sequelize.where(sequelize.fn("DAY", sequelize.col("tanggal")), dates),
        ],
      },
    });

    if (isIncomeExists) {
      const result = await db.transaction(async (t) => {
        const penjualan = await Penjualan_Pupuk.create({
          jumlah_terjual,
          hasil_penjualan,
          tanggal,
        });

        const penghasilan = await Penghasilan.update(
          {
            kas_penghasilan:
              parseFloat(isIncomeExists.kas_penghasilan) +
              parseFloat(hasil_penjualan),
          },
          { where: { id: isIncomeExists.id } }
        );

        if (isDailyIncomeExists) {
          await Penghasilan_Harian.update(
            {
              terjual:
                parseInt(isDailyIncomeExists.terjual) +
                parseInt(jumlah_terjual),
              total:
                parseFloat(isDailyIncomeExists.total) +
                parseFloat(hasil_penjualan),
            },
            {
              where: {
                [Op.and]: [
                  sequelize.where(
                    sequelize.fn("YEAR", sequelize.col("tanggal")),
                    year
                  ),
                  sequelize.where(
                    sequelize.fn("MONTH", sequelize.col("tanggal")),
                    month
                  ),
                  sequelize.where(
                    sequelize.fn("DAY", sequelize.col("tanggal")),
                    dates
                  ),
                ],
              },
            }
          );
          return penjualan;
        } else {
          const penghasilan_harian = await Penghasilan_Harian.create({
            terjual: jumlah_terjual,
            total: hasil_penjualan,
            tanggal,
          });
          return { penjualan, penghasilan_harian };
        }
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully post data penjualan pupuk",
        data: result,
      });
    } else {
      const result = await db.transaction(async (t) => {
        const penjualan = await Penjualan_Pupuk.create({
          jumlah_terjual,
          hasil_penjualan,
          tanggal,
        });

        const penghasilan = await Penghasilan.create({
          kas_penghasilan: hasil_penjualan,
        });

        const penghasilan_harian = await Penghasilan_Harian.create({
          terjual: jumlah_terjual,
          total: hasil_penjualan,
          tanggal,
        });

        return { penjualan, penghasilan, penghasilan_harian };
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully post data penjualan pupuk",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllPenjualanPupuk = async (req, res, next) => {
  try {
    const data = await Penjualan_Pupuk.findAll();

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data catatan pupuk",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPenjualanPupukById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Penjualan_Pupuk.findOne({ id });

    if (data) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data catatan pupuk",
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

const getAllPenjualanUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Penjualan_Pupuk.sum("jumlah_terjual", {
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

    const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
      msg: "Successfully get data penjualan pupuk",
      data,
      data2,
    });
  } catch (error) {
    next(error);
  }
};

const getYearlySumOfPenjualanPupuk = async (req, res, next) => {
  const arr = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ];

  const { month, year } = req.query;
  const arrQuery = [];

  if (month !== undefined) {
    const listOfMonths = month.split(",");
    for (let i = 0; i < listOfMonths.length; i++) {
      arrQuery.push([
        sequelize.fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN MONTH(${`tanggal`}) = '0${
              parseInt(listOfMonths[i]) + 1
            }' THEN jumlah_terjual ELSE 0 END`
          )
        ),
        arr[listOfMonths[i]],
      ]);
    }
  } else {
    let increment = 1;
    for (let i = 0; i < arr.length; i++) {
      arrQuery.push([
        sequelize.fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN MONTH(${`tanggal`}) = '0${increment++}' THEN jumlah_terjual ELSE 0 END`
          )
        ),
        arr[i],
      ]);
    }
  }
  const date = new Date().getFullYear();
  const whatYear = year === undefined ? date : year;

  try {
    const result = await Penjualan_Pupuk.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            whatYear
          ),
        ],
      },
      attributes: arrQuery,
      dataType: "decimal(16,3)",
    });

    const listOfYear = await Penjualan_Pupuk.findAll({
      attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
      group: "tahun",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Hasil perahan successfully created...",
      result,
      listOfYear,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlySumOfPenjualanPupuk = async (req, res, next) => {
  const { month, year } = req.query;
  const date = new Date().getFullYear();
  const currMonth = new Date().getUTCMonth() + 1;
  const whatYear = year === undefined ? date : year;
  const whatMonth = month === undefined ? currMonth : month;

  const monthLength = new Date(whatYear, whatMonth, 0).getDate();

  const arrQuery = [];

  for (let i = 0; i < monthLength; i++) {
    arrQuery.push([
      sequelize.fn(
        "SUM",
        sequelize.literal(
          `CASE WHEN DAY(${`tanggal`}) = '0${
            i + 1
          }' THEN jumlah_terjual ELSE 0 END`
        )
      ),
      `${i + 1}`,
    ]);
  }

  try {
    const result = await Penjualan_Pupuk.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            whatYear
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            whatMonth
          ),
        ],
      },
      attributes: arrQuery,
      dataType: "decimal(16,3)",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Hasil perahan successfully fetched...",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getPenjualanBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Penjualan_Pupuk.findAll({
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
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Penjualan_Pupuk.findAll({
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
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
        data,
      });
    } else if (search === "today") {
      const data = await Penjualan_Pupuk.findAll({
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
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
        data,
      });
    } else if (search === "this_week") {
      const data = await Penjualan_Pupuk.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Penjualan_Pupuk.findAll({
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
          order: [["tanggal", "ASC"]],
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data penjualan pupuk",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Penjualan_Pupuk.findAll({
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
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

const getPenjualanSumBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
      const data = await Penjualan_Pupuk.sum("jumlah_terjual", {
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
        msg: "Successfully get data penjualan pupuk",
        data,
        data2,
      });
    } else if (search === "prev_month") {
      const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
      const data = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
        msg: "Successfully get data penjualan pupuk",
        data,
        data2,
      });
    } else if (search === "today") {
      const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
      const data = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
        msg: "Successfully get data penjualan pupuk",
        data,
        data2,
      });
    } else if (search === "this_week") {
      const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });
      const data = await Penjualan_Pupuk.sum("hasil_penjualan", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
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
        const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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

        const data = await Penjualan_Pupuk.sum("jumlah_terjual", {
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
          msg: "Successfully get data penjualan pupuk",
          data,
          data2,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });

        const data = await Penjualan_Pupuk.sum("jumlah_terjual", {
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
          msg: "Successfully get data penjualan pupuk",
          data,
          data2,
        });
      } else {
        const data2 = await Penjualan_Pupuk.sum("hasil_penjualan", {
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
        });

        const data = await Penjualan_Pupuk.sum("jumlah_terjual", {
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
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data penjualan pupuk",
          data,
          data2,
        });
      }
    } else if (search === "all") {
      const data = await Penjualan_Pupuk.sum("jumlah_terjual");
      const data2 = await Penjualan_Pupuk.sum("hasil_penjualan");

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan pupuk",
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

const updatePenjualanPupuk = async (req, res, next) => {
  const { jumlah_terjual, hasil_penjualan, tanggal } = req.body;
  try {
    const result = await db.transaction(async (t) => {
      const findPenjualan = await Penjualan_Pupuk.findOne({
        where: { id: req.params.id },
      });

      const findPenghasilan = await Penghasilan.findOne();

      const date = new Date(findPenjualan.tanggal);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const dates = date.getDate();

      const penjualan = await Penjualan_Pupuk.update(
        {
          jumlah_terjual,
          hasil_penjualan,
          tanggal,
        },
        { where: { id: req.params.id } }
      );

      const harianPenghasilan = await Penghasilan_Harian.sum("total");
      const harianPengeluaran = await Pengeluaran.sum("pengeluaran");
      const kas_penghasilan =
        parseInt(harianPenghasilan) - parseInt(harianPengeluaran);
      const harianTerjual = await Penjualan_Pupuk.sum("jumlah_terjual", {
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              year
            ),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              month
            ),
            sequelize.where(
              sequelize.fn("DAY", sequelize.col("tanggal")),
              dates
            ),
          ],
        },
      });

      const harianTerjualPaket = await Penjualan_Pupuk.sum("hasil_penjualan", {
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              year
            ),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              month
            ),
            sequelize.where(
              sequelize.fn("DAY", sequelize.col("tanggal")),
              dates
            ),
          ],
        },
      });

      const harianTerjualPaketSusu = await Penjualan_Susu.sum(
        "jumlah_terjual_paket",
        {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("tanggal")),
                month
              ),
              sequelize.where(
                sequelize.fn("DAY", sequelize.col("tanggal")),
                dates
              ),
            ],
          },
        }
      );

      const harianTerjualSusu = await Penjualan_Susu.sum("hasil_penjualan", {
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              year
            ),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal")),
              month
            ),
            sequelize.where(
              sequelize.fn("DAY", sequelize.col("tanggal")),
              dates
            ),
          ],
        },
      });

      const penghasilan = await Penghasilan.update(
        {
          kas_penghasilan,
        },
        { where: { id: findPenghasilan.id } }
      );

      const penghasilan_harian = await Penghasilan_Harian.update(
        {
          terjual: parseInt(harianTerjual) + parseInt(harianTerjualPaketSusu),
          total: parseInt(harianTerjualPaket) + parseInt(harianTerjualSusu),
        },
        {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("tanggal")),
                month
              ),
              sequelize.where(
                sequelize.fn("DAY", sequelize.col("tanggal")),
                dates
              ),
            ],
          },
        }
      );

      return 1;
    });

    if (result === 1) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully update data penjualan pupuk",
        data: result,
      });
    } else {
      res.status(422).send({
        statusCode: res.statusCode,
        msg: "Failed to update penjualan pupuk",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postPenjualanPupuk,
  getAllPenjualanPupuk,
  getPenjualanPupukById,
  getAllPenjualanUntillToday,
  getMonthlySumOfPenjualanPupuk,
  getYearlySumOfPenjualanPupuk,
  getPenjualanBasedOnQuery,
  getPenjualanSumBasedOnQuery,
  updatePenjualanPupuk,
};
