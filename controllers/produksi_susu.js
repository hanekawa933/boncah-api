const { db } = require("../db/connection");
const {
  Produksi_Susu,
  Stock_Produksi_Susu,
  Jenis_Susu,
  Penjualan_Susu,
} = require("../models/model");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postProduksiSusu = async (req, res, next) => {
  let emptyObject = {};
  let resultOfQuery = {};
  const { tanggal } = req.body;
  try {
    const getAllJenisSusu = await Jenis_Susu.findAll();

    for await (const result of getAllJenisSusu) {
      const jenis_susu = `${result.jenis_susu}`.toLowerCase();
      const jumlah_paket = `jumlah_paket_${result.jenis_susu}`.toLowerCase();
      emptyObject = {
        ...emptyObject,
        [jenis_susu]: req.body[jenis_susu],
        [jumlah_paket]: req.body[jumlah_paket],
      };

      const isStockExists = await Stock_Produksi_Susu.findOne({
        where: { jenis_susu_id: req.body[jenis_susu] },
      });

      const total_liter =
        parseFloat(req.body[jumlah_paket]) * parseFloat(0.125);

      if (isStockExists) {
        if (req.body[jumlah_paket] > 0) {
          const result = await db.transaction(async (t) => {
            const produksi = await Produksi_Susu.create({
              jumlah_paket: req.body[jumlah_paket],
              jumlah_liter: total_liter,
              tanggal,
              jenis_susu_id: req.body[jenis_susu],
            });

            const stock = await Stock_Produksi_Susu.update(
              {
                jumlah_paket:
                  parseInt(isStockExists.jumlah_paket) +
                  parseInt(req.body[jumlah_paket]),
                jumlah_liter:
                  parseFloat(isStockExists.jumlah_liter) + total_liter,
              },
              { where: { jenis_susu_id: req.body[jenis_susu] } }
            );
            resultOfQuery = { ...resultOfQuery, [jenis_susu]: produksi };
            return resultOfQuery;
          });
        }
      } else {
        const result = await db.transaction(async (t) => {
          let produksi = undefined;
          if (req.body[jumlah_paket] > 0) {
            produksi = await Produksi_Susu.create({
              jumlah_paket: req.body[jumlah_paket],
              jumlah_liter: total_liter,
              tanggal,
              jenis_susu_id: req.body[jenis_susu],
            });
          }

          const stock = await Stock_Produksi_Susu.create({
            jumlah_paket: req.body[jumlah_paket],
            jumlah_liter: total_liter,
            tanggal,
            jenis_susu_id: req.body[jenis_susu],
          });
          resultOfQuery = {
            ...resultOfQuery,
            [jenis_susu]: produksi,
            [`stock_${jenis_susu}`]: stock,
          };
          return { produksi, stock };
        });
      }
    }
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully post produksi susu...",
      data: resultOfQuery,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// const postProduksiSusu = async (req, res, next) => {
//   const { jumlah_paket, tanggal, jenis_susu_id } = req.body;
//   try {
//     const isStockExists = await Stock_Produksi_Susu.findOne({
//       where: { jenis_susu_id },
//     });

//     const total_liter = parseFloat(jumlah_paket) * parseFloat(0.125);

//     if (isStockExists) {
//       const result = await db.transaction(async (t) => {
//         const produksi = await Produksi_Susu.create({
//           jumlah_paket,
//           jumlah_liter: total_liter,
//           tanggal,
//           jenis_susu_id,
//         });

//         const stock = await Stock_Produksi_Susu.update(
//           {
//             jumlah_paket:
//               parseInt(isStockExists.jumlah_paket) + parseInt(jumlah_paket),
//             jumlah_liter: parseFloat(isStockExists.jumlah_liter) + total_liter,
//           },
//           { where: { jenis_susu_id } }
//         );
//         return { produksi };
//       });

//       res.status(200).send({
//         statusCode: res.statusCode,
//         msg: "Successfully post produksi susu...",
//         data: result,
//       });
//     } else {
//       const result = await db.transaction(async (t) => {
//         const produksi = await Produksi_Susu.create({
//           jumlah_paket,
//           jumlah_liter: total_liter,
//           tanggal,
//           jenis_susu_id,
//         });

//         const stock = await Stock_Produksi_Susu.create({
//           jumlah_paket,
//           jumlah_liter: total_liter,
//           tanggal,
//           jenis_susu_id,
//         });
//         return { produksi, stock };
//       });

//       res.status(200).send({
//         statusCode: res.statusCode,
//         msg: "Successfully post produksi susu...",
//         data: result,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const getDataStockSusu = async (req, res, next) => {
  let result = [];
  let name = [];
  try {
    const jenis_susu = await Jenis_Susu.findAll();

    for await (const res of jenis_susu) {
      const data = await Stock_Produksi_Susu.findAll({
        where: { jenis_susu_id: res.id },
        include: { model: Jenis_Susu },
      });

      name = [...name, { id: res.id, name: res.jenis_susu.toLowerCase() }];

      result = [...result, data[0]];
    }

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get stock produksi susu",
      data: { name, result },
    });
  } catch (error) {
    next(error);
  }
};

const getProduksiSusuUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Produksi_Susu.sum("jumlah_paket", {
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

    const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
      msg: "Successfully get data produksi susu",
      data,
      data2,
    });
  } catch (error) {
    next(error);
  }
};

const getYearlySumOfProduksiSusu = async (req, res, next) => {
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

  const { month, year, jenis_susu_id } = req.query;
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
            }' THEN jumlah_paket ELSE 0 END`
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
            `CASE WHEN MONTH(${`tanggal`}) = '0${increment++}' THEN jumlah_paket ELSE 0 END`
          )
        ),
        arr[i],
      ]);
    }
  }
  const date = new Date().getFullYear();
  const whatYear = year === undefined ? date : year;
  const whatJID = jenis_susu_id === undefined ? 0 : jenis_susu_id;

  try {
    if (whatJID === 0 || whatJID === "0") {
      const result = await Produksi_Susu.findAll({
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

      const listOfYear = await Produksi_Susu.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });

      const listOfJID = await Jenis_Susu.findAll();

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        result,
        listOfYear,
        listOfJID,
      });
    } else {
      const result = await Produksi_Susu.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              whatYear
            ),
          ],
          jenis_susu_id: whatJID,
        },
        attributes: arrQuery,
        dataType: "decimal(16,3)",
      });

      const listOfYear = await Produksi_Susu.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });

      const listOfJID = await Jenis_Susu.findAll();

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        result,
        listOfYear,
        listOfJID,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMonthlySumOfProduksiSusu = async (req, res, next) => {
  const { month, year, jenis_susu_id } = req.query;
  const date = new Date().getFullYear();
  const currMonth = new Date().getUTCMonth() + 1;
  const whatYear = year === undefined ? date : year;
  const whatMonth = month === undefined ? currMonth : month;
  const whatJID = jenis_susu_id === undefined ? 0 : jenis_susu_id;

  const monthLength = new Date(whatYear, whatMonth, 0).getDate();

  const arrQuery = [];

  for (let i = 0; i < monthLength; i++) {
    arrQuery.push([
      sequelize.fn(
        "SUM",
        sequelize.literal(
          `CASE WHEN DAY(${`tanggal`}) = '0${
            i + 1
          }' THEN jumlah_paket ELSE 0 END`
        )
      ),
      `${i + 1}`,
    ]);
  }

  try {
    if (whatJID === 0 || whatJID === "0") {
      const result = await Produksi_Susu.findAll({
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
    } else {
      const result = await Produksi_Susu.findAll({
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
          jenis_susu_id: whatJID,
        },
        attributes: arrQuery,
        dataType: "decimal(16,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getStockProduksiSusu = async (req, res, next) => {
  try {
    const data = await Stock_Produksi_Susu.sum("jumlah_paket", {
      dataType: "integer",
    });

    const data2 = await Stock_Produksi_Susu.sum("jumlah_liter", {
      dataType: "decimal(12,3)",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data sum of stock susu",
      data,
      data2,
    });
  } catch (error) {
    next(error);
  }
};

const postDummyPS = async (req, res, next) => {
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

  const arr = [];
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

    arr.push({
      jumlah_paket: hp,
      jumlah_liter: t,
      jenis_susu_id: w,
      tanggal: date,
    });
  }
  try {
    const data = await Produksi_Susu.bulkCreate(arr);

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Hasil perahan successfully created...",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getStockSusu = async (req, res, next) => {
  try {
    const data = await Stock_Produksi_Susu.findAll({
      include: { model: Jenis_Susu },
    });
    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get stock susu",
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
      const data = await Produksi_Susu.findAll({
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
          model: Jenis_Susu,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Produksi_Susu.findAll({
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
          model: Jenis_Susu,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
      });
    } else if (search === "today") {
      const data = await Produksi_Susu.findAll({
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
          model: Jenis_Susu,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
      });
    } else if (search === "this_week") {
      const data = await Produksi_Susu.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
        include: { model: Jenis_Susu },
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Produksi_Susu.findAll({
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
            model: Jenis_Susu,
          },
          order: [["tanggal", "ASC"]],
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data produksi susu",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Produksi_Susu.findAll({
        include: {
          model: Jenis_Susu,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
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
      const data = await Produksi_Susu.sum("jumlah_paket", {
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
      const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
        data2,
      });
    } else if (search === "prev_month") {
      const data = await Produksi_Susu.sum("jumlah_paket", {
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
      const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
        data2,
      });
    } else if (search === "today") {
      const data = await Produksi_Susu.sum("jumlah_paket", {
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

      const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
        data,
        data2,
      });
    } else if (search === "this_week") {
      const data = await Produksi_Susu.sum("jumlah_paket", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });
      const data2 = await Produksi_Susu.sum("jumlah_liter", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
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
        const data = await Produksi_Susu.sum("jumlah_paket", {
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
        const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
          dataType: "decimal(12,3)",
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data produksi susu",
          data,
          data2,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data = await Produksi_Susu.sum("jumlah_paket", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });
        const data2 = await Produksi_Susu.sum("jumlah_liter", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
          dataType: "decimal(12,3)",
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data produksi susu",
          data,
          data2,
        });
      } else {
        const data = await Produksi_Susu.sum("jumlah_paket", {
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
        const data2 = await Produksi_Susu.sum("jumlah_liter", {
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
          dataType: "decimal(12,3)",
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data produksi susu",
          data,
          data2,
        });
      }
    } else if (search === "all") {
      const data = await Produksi_Susu.sum("jumlah_paket");
      const data2 = await Produksi_Susu.sum("jumlah_liter", {
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data produksi susu",
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

const updateProduksiSusu = async (req, res, next) => {
  const { jenis_susu_id, jumlah_paket, tanggal } = req.body;
  try {
    const result = await db.transaction(async (t) => {
      const update = await Produksi_Susu.update(
        {
          jumlah_paket,
          jumlah_liter: parseInt(jumlah_paket) * 0.125,
          tanggal,
          jenis_susu_id,
        },
        {
          where: { id: req.params.id },
        }
      );

      const getAllJenisSusu = await Jenis_Susu.findAll();

      for await (const result of getAllJenisSusu) {
        const sumPenjualanByJenisSusu = await Penjualan_Susu.sum(
          "jumlah_terjual_paket",
          { where: { jenis_susu_id: result.id } }
        );
        const sumProduksiByJenisSusu = await Produksi_Susu.sum("jumlah_paket", {
          where: { jenis_susu_id: result.id },
        });
        const sumTotalStock =
          parseInt(sumProduksiByJenisSusu) - parseInt(sumPenjualanByJenisSusu);

        const stock = await Stock_Produksi_Susu.update(
          {
            jumlah_paket: sumTotalStock,
            jumlah_liter: sumTotalStock * 0.125,
          },
          { where: { jenis_susu_id: result.id } }
        );
      }

      return 1;
    });

    if (result === 1) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully update produksi susu...",
        result,
      });
    } else {
      res.status(422).send({
        statusCode: res.statusCode,
        msg: "Failed to update produksi susu...",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postProduksiSusu,
  getProduksiSusuUntillToday,
  getYearlySumOfProduksiSusu,
  getMonthlySumOfProduksiSusu,
  postDummyPS,
  getStockProduksiSusu,
  getStockSusu,
  getDataStockSusu,
  getProduksiBasedOnQuery,
  getProduksiSumBasedOnQuery,
  updateProduksiSusu,
};
