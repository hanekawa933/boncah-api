const {
  Hasil_Perahan,
  Keterangan_Pemerahan,
  Waktu_Pemerahan,
} = require("../models/model");

const { db } = require("../db/connection");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postHasilPerahan = async (req, res, next) => {
  const {
    hasil_perahan,
    hasil_berkurang,
    keterangan_pemerahan_id,
    tanggal,
    waktu_pemerahan_id,
  } = req.body;

  const hasil = parseFloat(hasil_perahan);
  const kurang = parseFloat(hasil_berkurang);
  const total = hasil - kurang;
  try {
    const isOther = await Keterangan_Pemerahan.findOne({
      where: { id: keterangan_pemerahan_id },
    });

    if (isOther) {
      const data = await Hasil_Perahan.create({
        hasil_perahan,
        hasil_berkurang,
        total_perahan: total,
        keterangan_pemerahan_id,
        tanggal,
        waktu_pemerahan_id,
      });
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        data,
      });
    } else {
      const result = await db.transaction(async (t) => {
        const keterangan_pemerahan = await Keterangan_Pemerahan.create({
          keterangan: keterangan_pemerahan_id,
        });

        const data = await Hasil_Perahan.create({
          hasil_perahan,
          hasil_berkurang,
          total_perahan: total,
          keterangan_pemerahan_id: keterangan_pemerahan.getDataValue("id"),
          tanggal,
          waktu_pemerahan_id,
        });
        return { data, keterangan_pemerahan };
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        data: result,
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postDummy = async (req, res, next) => {
  let j = 1;

  function getRandomInt(max) {
    return Math.floor(Math.random() * max + max);
  }

  function getRandomIntT(min) {
    return Math.floor(Math.random() * min);
  }

  function getRandomIntR(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  const arr = [];

  for (j; j <= 31; j++) {
    hp = getRandomInt(5);
    hb = getRandomIntT(5);
    t = parseFloat(hp) - parseFloat(hb);
    const time = new Date();

    const date = new Date(
      `08/${j}/2021 ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    );
    arr.push({
      hasil_perahan: hp,
      hasil_berkurang: hb,
      total_perahan: t,
      keterangan_pemerahan_id: getRandomIntR(1, 2),
      waktu_pemerahan_id: getRandomIntR(1, 2),
      tanggal: date,
    });
  }
  try {
    const data = await Hasil_Perahan.bulkCreate(arr);

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Hasil perahan successfully created...",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getYearlySumOfTotalPerasan = async (req, res, next) => {
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

  const { month, year, time } = req.query;
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
            }' THEN total_perahan ELSE 0 END`
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
            `CASE WHEN MONTH(${`tanggal`}) = '0${increment++}' THEN total_perahan ELSE 0 END`
          )
        ),
        arr[i],
      ]);
    }
  }
  const date = new Date().getFullYear();
  const whatYear = year === undefined ? date : year;

  try {
    if (time === undefined) {
      const result = await Hasil_Perahan.findAll({
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

      const listOfYear = await Hasil_Perahan.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });

      const listOfTime = await Hasil_Perahan.findAll({
        attributes: ["waktu_pemerahan_id"],
        group: "waktu_pemerahan_id",
        include: [Waktu_Pemerahan],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully created...",
        result,
        listOfYear,
        listOfTime,
      });
    } else {
      const result = await Hasil_Perahan.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal")),
              whatYear
            ),
          ],
          waktu_pemerahan_id: time,
        },
        attributes: arrQuery,
        dataType: "decimal(16,3)",
      });
      const listOfYear = await Hasil_Perahan.findAll({
        attributes: [[sequelize.fn("YEAR", sequelize.col("tanggal")), "tahun"]],
        group: "tahun",
      });
      const listOfTime = await Hasil_Perahan.findAll({
        attributes: ["waktu_pemerahan_id"],
        group: "waktu_pemerahan_id",
        include: [Waktu_Pemerahan],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Hasil perahan successfully fetched...",
        result,
        listOfYear,
        listOfTime,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMonthlySumOfTotalPerasan = async (req, res, next) => {
  const { month, year, time } = req.query;
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
          }' THEN total_perahan ELSE 0 END`
        )
      ),
      `${i + 1}`,
    ]);
  }

  console.log(monthLength);

  try {
    if (time === undefined) {
      const result = await Hasil_Perahan.findAll({
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
      const result = await Hasil_Perahan.findAll({
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
          waktu_pemerahan_id: time,
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

const getHasilPerahanUntillToday = async (req, res, next) => {
  try {
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const data = await Hasil_Perahan.sum("total_perahan", {
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
      dataType: "decimal(16,3)",
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data hasil perahan",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getHasilPerahanUntillToday2 = async (req, res, next) => {
  try {
    const data = await Hasil_Perahan.findAll();

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get data hasil perahan",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPerahanBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Hasil_Perahan.findAll({
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
        include: [
          {
            model: Keterangan_Pemerahan,
          },
          {
            model: Waktu_Pemerahan,
          },
        ],
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Hasil_Perahan.findAll({
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
        include: [
          {
            model: Keterangan_Pemerahan,
          },
          {
            model: Waktu_Pemerahan,
          },
        ],
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "today") {
      const data = await Hasil_Perahan.findAll({
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
        include: [
          {
            model: Keterangan_Pemerahan,
          },
          {
            model: Waktu_Pemerahan,
          },
        ],
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "this_week") {
      const data = await Hasil_Perahan.findAll({
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
        include: [
          {
            model: Keterangan_Pemerahan,
          },
          {
            model: Waktu_Pemerahan,
          },
        ],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "custom") {
      if (year === undefined || month === undefined || date === undefined) {
        res.status(404);
        next();
      } else {
        const data = await Hasil_Perahan.findAll({
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
          include: [
            {
              model: Keterangan_Pemerahan,
            },
            {
              model: Waktu_Pemerahan,
            },
          ],
          order: [["tanggal", "ASC"]],
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Successfully get data perahan susu",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Hasil_Perahan.findAll({
        include: [
          {
            model: Keterangan_Pemerahan,
          },
          {
            model: Waktu_Pemerahan,
          },
        ],
        order: [["tanggal", "ASC"]],
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else {
      res.status(404);
      next();
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getHasilPerahanSumBasedOnQuery = async (req, res, next) => {
  const { search, year, month, date } = req.query;

  const dateObj = new Date();
  const getDate = dateObj.getDate();
  const getMonth = dateObj.getMonth() + 1;
  const getYear = dateObj.getFullYear();

  try {
    if (search === undefined) {
      const data = await Hasil_Perahan.sum("total_perahan", {
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
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "prev_month") {
      const data = await Hasil_Perahan.sum("total_perahan", {
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
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "today") {
      const data = await Hasil_Perahan.sum("total_perahan", {
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
        msg: "Successfully get data perahan susu",
        data,
      });
    } else if (search === "this_week") {
      const data = await Hasil_Perahan.sum("total_perahan", {
        where: sequelize.where(
          sequelize.fn("WEEKOFYEAR", sequelize.col("tanggal")),
          sequelize.fn("WEEKOFYEAR", sequelize.fn("NOW"))
        ),
        order: [["tanggal", "ASC"]],
        include: { model: Keterangan_Pemerahan },
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
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
        const data = await Hasil_Perahan.sum("total_perahan", {
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
          msg: "Successfully get data perahan susu",
          data,
        });
      } else if (
        year !== undefined &&
        month === undefined &&
        date === undefined
      ) {
        const data = await Hasil_Perahan.sum("total_perahan", {
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
          msg: "Successfully get data perahan susu",
          data,
        });
      } else {
        const data = await Hasil_Perahan.sum("total_perahan", {
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
          msg: "Successfully get data perahan susu",
          data,
        });
      }
    } else if (search === "all") {
      const data = await Hasil_Perahan.sum("total_perahan");

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data perahan susu",
        data,
      });
    } else {
      res.status(404);
      next();
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const updateHasilPerahan = async (req, res, next) => {
  const {
    hasil_perahan,
    hasil_berkurang,
    keterangan_pemerahan_id,
    tanggal,
    waktu_pemerahan_id,
  } = req.body;

  const hasil = parseFloat(hasil_perahan);
  const kurang = parseFloat(hasil_berkurang);
  const total = hasil - kurang;
  try {
    const isOther = await Keterangan_Pemerahan.findOne({
      where: { id: keterangan_pemerahan_id },
    });

    if (isOther) {
      const data = await Hasil_Perahan.update(
        {
          hasil_perahan,
          hasil_berkurang,
          total_perahan: total,
          keterangan_pemerahan_id,
          tanggal,
          waktu_pemerahan_id,
        },
        { where: { id: req.params.id } }
      );

      if (data[0] === 1) {
        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Hasil perahan successfully updated...",
        });
      } else {
        res.status(422).send({
          statusCode: res.statusCode,
          msg: "Hasil perahan failed to be updated...",
        });
      }
    } else {
      const result = await db.transaction(async (t) => {
        const keterangan_pemerahan = await Keterangan_Pemerahan.create({
          keterangan: keterangan_pemerahan_id,
        });

        const data = await Hasil_Perahan.update(
          {
            hasil_perahan,
            hasil_berkurang,
            total_perahan: total,
            keterangan_pemerahan_id: keterangan_pemerahan.getDataValue("id"),
            tanggal,
            waktu_pemerahan_id,
          },
          { where: { id: req.params.id } }
        );

        return 1;
      });

      if (result === 1) {
        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Hasil perahan successfully updated...",
        });
      } else {
        res.status(422).send({
          statusCode: res.statusCode,
          msg: "Hasil perahan failed to be updated...",
        });
      }
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = {
  postHasilPerahan,
  getHasilPerahanUntillToday,
  getHasilPerahanUntillToday2,
  postDummy,
  getYearlySumOfTotalPerasan,
  getMonthlySumOfTotalPerasan,
  getPerahanBasedOnQuery,
  getHasilPerahanSumBasedOnQuery,
  updateHasilPerahan,
};
