const {
  Produksi_Pupuk,
  Stock_Pupuk,
  Penjualan_Pupuk,
  Penjualan_Susu,
} = require("../models/model");

const { db } = require("../db/connection");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postPupuk = async (req, res, next) => {
  const { jumlah_karung, tanggal } = req.body;
  try {
    const isStockExists = await Stock_Pupuk.findOne();

    if (isStockExists) {
      const result = await db.transaction(async () => {
        const produksi = await Produksi_Pupuk.create({
          jumlah_karung,
          tanggal,
        });

        const stock = await Stock_Pupuk.update(
          {
            jumlah_karung:
              parseFloat(isStockExists.jumlah_karung) +
              parseFloat(jumlah_karung),
          },
          { where: { id: isStockExists.id } }
        );
        return produksi;
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully post data catatan pupuk",
        data: result,
      });
    } else {
      const result = await db.transaction(async () => {
        const produksi = await Produksi_Pupuk.create({
          jumlah_karung,
          tanggal,
        });

        const stock = await Stock_Pupuk.create({
          jumlah_karung: jumlah_karung,
        });
        return { produksi, stock };
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully post data catatan pupuk",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllPupuk = async (req, res, next) => {
  try {
    const data = await Pupuk.findAll();

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data catatan pupuk",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPupukById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Pupuk.findOne({ id });

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

const getStockProduksiPupuk = async (req, res, next) => {
  try {
    const data = await Stock_Pupuk.sum("jumlah_karung", {
      dataType: "integer",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data sum of stock pupuk",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getProduksiPupukUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Produksi_Pupuk.sum("jumlah_karung", {
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

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data produksi susu",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getYearlySumOfProduksiPupuk = async (req, res, next) => {
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
            }' THEN jumlah_karung ELSE 0 END`
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
            `CASE WHEN MONTH(${`tanggal`}) = '0${increment++}' THEN jumlah_karung ELSE 0 END`
          )
        ),
        arr[i],
      ]);
    }
  }
  const date = new Date().getFullYear();
  const whatYear = year === undefined ? date : year;

  try {
    const result = await Produksi_Pupuk.findAll({
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

    const listOfYear = await Produksi_Pupuk.findAll({
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

const getMonthlySumOfProduksiPupuk = async (req, res, next) => {
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
          }' THEN jumlah_karung ELSE 0 END`
        )
      ),
      `${i + 1}`,
    ]);
  }

  try {
    const result = await Produksi_Pupuk.findAll({
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

const postDummyPP = async (req, res, next) => {
  let j = 1;

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomIntT(min) {
    return Math.floor(Math.random() * min);
  }

  function getRandomIntR(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  const pupuk = [];
  const penPupuk = [];
  const penSusu = [];
  let totalVal = 0;
  let totalVal2 = 0;
  let totalVal3 = 0;
  let totalVal4 = 0;

  let totalValJT = 0;
  let totalValJT2 = 0;
  let totalValJT3 = 0;
  let totalValJT4 = 0;

  for (j; j <= 31; j++) {
    hp = getRandomIntR(1, 15);
    t = parseFloat(hp) * parseFloat(0.125);
    w = getRandomIntR(1, 4);
    const time = new Date();

    const date = new Date(
      `12/${j}/2021 ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    );

    if (w === 1) {
      totalVal = totalVal + hp;
      totalValJT = totalValJT + t;
    } else if (w === 2) {
      totalVal2 = totalVal2 + hp;
      totalValJT2 = totalValJT2 + t;
    } else if (w === 3) {
      totalVal3 = totalVal3 + hp;
      totalValJT3 = totalValJT3 + t;
    } else {
      totalVal4 = totalVal4 + hp;
      totalValJT4 = totalValJT4 + t;
    }

    pupuk.push({
      jumlah_karung: hp,
      hasil_penjualan: hp * 11000,
      tanggal: date,
    });

    // penSusu.push({
    //   jenis_susu_id: w,
    //   jumlah_terjual_paket: hp,
    //   jumlah_terjual_liter: hp * 0.125,
    //   hasil_penjualan: hp * 6000,
    //   tanggal: date,
    // });

    // penPupuk.push({
    //   jumlah_terjual: hp,
    //   hasil_penjualan: hp * 11000,
    //   tanggal: date,
    // });
  }
  try {
    const data = await Produksi_Pupuk.bulkCreate(pupuk);
    const data2 = await Penjualan_Pupuk.bulkCreate(penPupuk);
    const data3 = await Penjualan_Susu.bulkCreate(penSusu);

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Hasil perahan successfully created...",
      data,
      data2,
      data3,
    });
  } catch (error) {
    next(error);
  }
};

const getStockPupuk = async (req, res, next) => {
  try {
    const data = await Stock_Pupuk.findAll();
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data stock pupuk",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getProduksiBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Produksi_Pupuk.findAll({
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Produksi_Pupuk.findAll({
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "today") {
      const data = await Produksi_Pupuk.findAll({
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "this_week") {
      const data = await Produksi_Pupuk.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Produksi_Pupuk.findAll({
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
          msg: "Successfully get data produksi pupuk",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Produksi_Pupuk.findAll({
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi pupuk",
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

const getProduksiSumBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "today") {
      const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
        msg: "Successfully get data produksi pupuk",
        data,
      });
    } else if (search === "this_week") {
      const data = await Produksi_Pupuk.sum("jumlah_karung", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi pupuk",
        data,
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
        const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
          msg: "Successfully get data produksi pupuk",
          data,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
          msg: "Successfully get data produksi pupuk",
          data,
        });
      } else {
        const data = await Produksi_Pupuk.sum("jumlah_karung", {
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
          msg: "Successfully get data produksi pupuk",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Produksi_Pupuk.sum("jumlah_karung");

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi pupuk",
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

const updatePupuk = async (req, res, next) => {
  const { jumlah_karung, tanggal } = req.body;
  try {
    const result = await db.transaction(async () => {
      const produksi = await Produksi_Pupuk.update(
        {
          jumlah_karung,
          tanggal,
        },
        { where: { id: req.params.id } }
      );

      const sumByPenjualanPupuk = await Penjualan_Pupuk.sum("jumlah_terjual");
      const sumProduksiPupuk = await Produksi_Pupuk.sum("jumlah_karung");
      const sumTotalStock =
        parseInt(sumProduksiPupuk) - parseInt(sumByPenjualanPupuk);

      const stock_pupuk = await Stock_Pupuk.findOne();

      const stock = await Stock_Pupuk.update(
        {
          jumlah_karung: sumTotalStock,
        },
        { where: { id: stock_pupuk.id } }
      );

      return 1;
    });

    if (result === 1) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully update data produksi pupuk",
        data: result,
      });
    } else {
      res.status(422).send({
        statusCode: res.statusCode,
        msg: "Failed to update produksi pupuk",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postPupuk,
  getAllPupuk,
  getPupukById,
  getStockProduksiPupuk,
  getProduksiPupukUntillToday,
  getYearlySumOfProduksiPupuk,
  getMonthlySumOfProduksiPupuk,
  postDummyPP,
  getStockPupuk,
  getProduksiBasedOnQuery,
  getProduksiSumBasedOnQuery,
  updatePupuk,
};
