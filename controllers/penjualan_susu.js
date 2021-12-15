const {
  Penjualan_Susu,
  Penghasilan,
  Penghasilan_Harian,
  Stock_Produksi_Susu,
  Jenis_Susu,
  Pengeluaran,
  Penjualan_Pupuk,
  Produksi_Susu,
} = require("../models/model");

const { db } = require("../db/connection");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postPenjualanSusu = async (req, res, next) => {
  let emptyObject = {};
  let resultOfQuery = {};
  const { tanggal } = req.body;

  const date = new Date(tanggal);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dates = date.getDate();

  try {
    const getAllJenisSusu = await Jenis_Susu.findAll();

    for await (const result of getAllJenisSusu) {
      const jenis_susu = `${result.jenis_susu}`.toLowerCase();
      const jumlah_terjual_paket =
        `jumlah_terjual_${result.jenis_susu}`.toLowerCase();
      const hasil_penjualan =
        `hasil_penjualan_${result.jenis_susu}`.toLowerCase();
      emptyObject = {
        ...emptyObject,
        [jenis_susu]: req.body[jenis_susu],
        [jumlah_terjual_paket]: req.body[jumlah_terjual_paket],
        [hasil_penjualan]: req.body[hasil_penjualan],
      };

      const total_liter =
        parseFloat(req.body[jumlah_terjual_paket]) * parseFloat(0.125);

      const isEnoughStock = await Stock_Produksi_Susu.findOne({
        where: { jenis_susu_id: req.body[jenis_susu] },
      });
      const isIncomeExists = await Penghasilan.findOne();
      const isDailyIncomeExists = await Penghasilan_Harian.findOne({
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

      if (
        isEnoughStock &&
        isEnoughStock.jumlah_paket >= req.body[jumlah_terjual_paket]
      ) {
        if (isIncomeExists) {
          if (req.body[jumlah_terjual_paket] > 0) {
            const result = await db.transaction(async (t) => {
              const penjualan = await Penjualan_Susu.create({
                jenis_susu_id: req.body[jenis_susu],
                jumlah_terjual_paket: req.body[jumlah_terjual_paket],
                jumlah_terjual_liter: total_liter,
                hasil_penjualan: req.body[hasil_penjualan],
                tanggal,
              });

              const updateStock = await Stock_Produksi_Susu.update(
                {
                  jumlah_paket:
                    parseInt(isEnoughStock.jumlah_paket) -
                    parseInt(req.body[jumlah_terjual_paket]),
                  jumlah_liter:
                    parseFloat(isEnoughStock.jumlah_liter) - total_liter,
                },
                {
                  where: { jenis_susu_id: req.body[jenis_susu] },
                }
              );

              const penghasilan = await Penghasilan.update(
                {
                  kas_penghasilan:
                    parseFloat(isIncomeExists.kas_penghasilan) +
                    parseFloat(req.body[hasil_penjualan]),
                },
                { where: { id: isIncomeExists.id } }
              );

              if (isDailyIncomeExists) {
                await Penghasilan_Harian.update(
                  {
                    terjual:
                      parseInt(isDailyIncomeExists.terjual) +
                      parseInt(req.body[jumlah_terjual_paket]),
                    total:
                      parseFloat(isDailyIncomeExists.total) +
                      parseFloat(req.body[hasil_penjualan]),
                  },
                  { where: { id: isDailyIncomeExists.id } }
                );
                resultOfQuery = {
                  ...resultOfQuery,
                  [jenis_susu]: penjualan,
                };
                return penjualan;
              } else {
                const penghasilan_harian = await Penghasilan_Harian.create({
                  terjual: req.body[jumlah_terjual_paket],
                  total: req.body[hasil_penjualan],
                  tanggal,
                });

                resultOfQuery = {
                  ...resultOfQuery,
                  [jenis_susu]: penjualan,
                  [`penghasilan_harian_${jenis_susu}`]: penghasilan_harian,
                };
                return { penjualan, penghasilan_harian };
              }
            });
          }
        } else {
          if (req.body[jumlah_terjual_paket] > 0) {
            const result = await db.transaction(async (t) => {
              const penjualan = await Penjualan_Susu.create({
                jenis_susu_id: req.body[jenis_susu],
                jumlah_terjual_paket: req.body[jumlah_terjual_paket],
                jumlah_terjual_liter: total_liter,
                hasil_penjualan: req.body[hasil_penjualan],
                tanggal,
              });

              const updateStock = await Stock_Produksi_Susu.update(
                {
                  jumlah_paket:
                    parseInt(isEnoughStock.jumlah_paket) -
                    parseInt(req.body[jumlah_terjual_paket]),
                  jumlah_liter:
                    parseFloat(isEnoughStock.jumlah_liter) - total_liter,
                },
                {
                  where: { jenis_susu_id: req.body[jenis_susu] },
                }
              );

              const penghasilan = await Penghasilan.create({
                kas_penghasilan: req.body[hasil_penjualan],
              });

              const penghasilan_harian = await Penghasilan_Harian.create({
                terjual: req.body[jumlah_terjual_paket],
                total: req.body[hasil_penjualan],
                tanggal,
              });

              resultOfQuery = {
                ...resultOfQuery,
                [jenis_susu]: penjualan,
                penghasilan,
                [`penghasilan_harian_${jenis_susu}`]: penghasilan_harian,
              };

              return { penjualan, penghasilan, penghasilan_harian };
            });
          }
        }
      } else {
        resultOfQuery = {
          ...resultOfQuery,
          [jenis_susu]: "Not enough stock....",
        };
      }
    }

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully post penjualan susu...",
      data: resultOfQuery,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// const postPenjualanSusu = async (req, res, next) => {
//   const { jenis_susu_id, jumlah_terjual_paket, hasil_penjualan, tanggal } =
//     req.body;

//   const date = new Date(tanggal);
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const dates = date.getDate();

//   const total_liter = parseFloat(jumlah_terjual_paket) * parseFloat(0.125);
//   try {
//     const isEnoughStock = await Stock_Produksi_Susu.findOne({
//       where: { jenis_susu_id },
//     });
//     const isIncomeExists = await Penghasilan.findOne();
//     const isDailyIncomeExists = await Penghasilan_Harian.findOne({
//       where: {
//         [Op.and]: [
//           sequelize.where(sequelize.fn("YEAR", sequelize.col("tanggal")), year),
//           sequelize.where(
//             sequelize.fn("MONTH", sequelize.col("tanggal")),
//             month
//           ),
//           sequelize.where(sequelize.fn("DAY", sequelize.col("tanggal")), dates),
//         ],
//       },
//     });

//     if (isEnough && isEnoughStock.jumlah_paket >= jumlah_terjual_paket) {
//       if (isIncomeExists) {
//         const result = await db.transaction(async (t) => {
//           const penjualan = await Penjualan_Susu.create({
//             jenis_susu_id,
//             jumlah_terjual_paket,
//             jumlah_terjual_liter: total_liter,
//             hasil_penjualan,
//             tanggal,
//           });

//           const updateStock = await Stock_Produksi_Susu.update(
//             {
//               jumlah_paket:
//                 parseInt(isEnoughStock.jumlah_paket) -
//                 parseInt(jumlah_terjual_paket),
//               jumlah_liter:
//                 parseFloat(isEnoughStock.jumlah_liter) - total_liter,
//             },
//             {
//               where: { jenis_susu_id },
//             }
//           );

//           const penghasilan = await Penghasilan.update(
//             {
//               kas_penghasilan:
//                 parseFloat(isIncomeExists.kas_penghasilan) +
//                 parseFloat(hasil_penjualan),
//             },
//             { where: { id: isIncomeExists.id } }
//           );

//           if (isDailyIncomeExists) {
//             await Penghasilan_Harian.update(
//               {
//                 terjual:
//                   parseInt(isDailyIncomeExists.terjual) +
//                   parseInt(jumlah_terjual_paket),
//                 total:
//                   parseFloat(isDailyIncomeExists.total) +
//                   parseFloat(hasil_penjualan),
//               },
//               { where: { id: isDailyIncomeExists.id } }
//             );
//             return penjualan;
//           } else {
//             const penghasilan_harian = await Penghasilan_Harian.create({
//               terjual: jumlah_terjual_paket,
//               total: hasil_penjualan,
//               tanggal,
//             });
//             return { penjualan, penghasilan_harian };
//           }
//         });

//         res.status(200).send({
//           statusCode: res.statusCode,
//           msg: "Successfully post penjualan susu...",
//           data: result,
//         });
//       } else {
//         const result = await db.transaction(async (t) => {
//           const penjualan = await Penjualan_Susu.create({
//             jenis_susu_id,
//             jumlah_terjual_paket,
//             jumlah_terjual_liter: total_liter,
//             hasil_penjualan,
//             tanggal,
//           });

//           const updateStock = await Stock_Produksi_Susu.update(
//             {
//               jumlah_paket:
//                 parseInt(isEnoughStock.jumlah_paket) -
//                 parseInt(jumlah_terjual_paket),
//               jumlah_liter:
//                 parseFloat(isEnoughStock.jumlah_liter) - total_liter,
//             },
//             {
//               where: { jenis_susu_id },
//             }
//           );

//           const penghasilan = await Penghasilan.create({
//             kas_penghasilan: hasil_penjualan,
//           });

//           const penghasilan_harian = await Penghasilan_Harian.create({
//             terjual: jumlah_terjual_paket,
//             total: hasil_penjualan,
//             tanggal,
//           });

//           return { penjualan, penghasilan, penghasilan_harian };
//         });

//         res.status(200).send({
//           statusCode: res.statusCode,
//           msg: "Successfully post penjualan susu...",
//           data: result,
//         });
//       }
//     } else {
//       res.status(200).send({
//         statusCode: res.statusCode,
//         msg: "Not enough stock...",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const getAllPenjualanUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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

    const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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

const getYearlySumOfPenjualanSusu = async (req, res, next) => {
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
            }' THEN jumlah_terjual_paket ELSE 0 END`
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
            `CASE WHEN MONTH(${`tanggal`}) = '0${increment++}' THEN jumlah_terjual_paket ELSE 0 END`
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
      const result = await Penjualan_Susu.findAll({
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

      const listOfYear = await Penjualan_Susu.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });

      const listOfJID = await Jenis_Susu.findAll();

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Total Penjualan successfully fetched...",
        result,
        listOfYear,
        listOfJID,
      });
    } else {
      const result = await Penjualan_Susu.findAll({
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

      const listOfYear = await Penjualan_Susu.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });

      const listOfJID = await Jenis_Susu.findAll();

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Total Penjualan successfully fetched...",
        result,
        listOfYear,
        listOfJID,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMonthlySumOfPenjualanSusu = async (req, res, next) => {
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
          }' THEN jumlah_terjual_paket ELSE 0 END`
        )
      ),
      `${i + 1}`,
    ]);
  }

  try {
    if (whatJID === 0 || whatJID === "0") {
      const result = await Penjualan_Susu.findAll({
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
        msg: "Total Penjualan successfully fetched...",
        result,
      });
    } else {
      const result = await Penjualan_Susu.findAll({
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
        msg: "Total Penjualan successfully created...",
        result,
      });
    }
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
      const data = await Penjualan_Susu.findAll({
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
        msg: "Successfully get data penjualan susu",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Penjualan_Susu.findAll({
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
        msg: "Successfully get data penjualan susu",
        data,
      });
    } else if (search === "today") {
      const data = await Penjualan_Susu.findAll({
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
        msg: "Successfully get data penjualan susu",
        data,
      });
    } else if (search === "this_week") {
      const data = await Penjualan_Susu.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
        include: { model: Jenis_Susu },
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan susu",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Penjualan_Susu.findAll({
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
          msg: "Successfully get data penjualan susu",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Penjualan_Susu.findAll({
        include: {
          model: Jenis_Susu,
        },
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan susu",
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
      const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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
      const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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
      const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
        msg: "Successfully get data penjualan susu",
        data,
        data2,
        data3,
      });
    } else if (search === "prev_month") {
      const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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
      const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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
      const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
        msg: "Successfully get data penjualan susu",
        data,
        data2,
        data3,
      });
    } else if (search === "today") {
      const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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
      const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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
      const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
        msg: "Successfully get data penjualan susu",
        data,
        data2,
        data3,
      });
    } else if (search === "this_week") {
      const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });
      const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
      });
      const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan susu",
        data,
        data2,
        data3,
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
        const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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
        const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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
        const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
          msg: "Successfully get data penjualan susu",
          data,
          data2,
          data3,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });
        const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("tanggal")),
                year
              ),
            ],
          },
        });
        const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
          msg: "Successfully get data penjualan susu",
          data,
          data2,
          data3,
        });
      } else {
        const data = await Penjualan_Susu.sum("jumlah_terjual_paket", {
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
        const data2 = await Penjualan_Susu.sum("hasil_penjualan", {
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
        const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
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
          msg: "Successfully get data penjualan susu",
          data,
          data2,
          data3,
        });
      }
    } else if (search === "all") {
      const data = await Penjualan_Susu.sum("jumlah_terjual_paket");
      const data2 = await Penjualan_Susu.sum("hasil_penjualan");
      const data3 = await Penjualan_Susu.sum("jumlah_terjual_liter", {
        dataType: "decimal(12,3)",
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data penjualan susu",
        data,
        data2,
        data3,
      });
    } else {
      res.status(404);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const updatePenjualanSusu = async (req, res, next) => {
  const { jenis_susu_id, jumlah_terjual_paket, hasil_penjualan, tanggal } =
    req.body;
  try {
    const result = await db.transaction(async (t) => {
      const findPenjualan = await Penjualan_Susu.findOne({
        where: { id: req.params.id },
      });

      const findPenghasilan = await Penghasilan.findOne();

      const date = new Date(findPenjualan.tanggal);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const dates = date.getDate();

      const penjualan = await Penjualan_Susu.update(
        {
          jenis_susu_id,
          jumlah_terjual_paket,
          jumlah_terjual_liter: parseInt(jumlah_terjual_paket) * 0.125,
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
        msg: "Successfully update data penjualan susu",
        data: result,
      });
    } else {
      res.status(422).send({
        statusCode: res.statusCode,
        msg: "Failed to update penjualan susu",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postPenjualanSusu,
  getAllPenjualanUntillToday,
  getMonthlySumOfPenjualanSusu,
  getYearlySumOfPenjualanSusu,
  getPenjualanBasedOnQuery,
  getPenjualanSumBasedOnQuery,
  updatePenjualanSusu,
};
