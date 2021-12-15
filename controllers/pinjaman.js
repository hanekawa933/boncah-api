const { Pinjaman, Pegawai, Pinjaman_Bulanan } = require("../models/model");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postDataPinjaman = async (req, res) => {
  const { tanggal_peminjaman, keterangan, pinjaman, pegawai_id } = req.body;

  try {
    const getMonth = new Date(tanggal_peminjaman).getMonth() + 1;
    const getYear = new Date(tanggal_peminjaman).getUTCFullYear();

    const isBorrowMoneyThisMonth = await Pinjaman.findOne({
      where: {
        [Op.and]: [
          {
            pegawai_id,
          },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal_peminjaman")),
            getYear
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal_peminjaman")),
            getMonth
          ),
        ],
      },
    });

    if (!isBorrowMoneyThisMonth) {
      const addFirstTimeBorrowMoneyThisMonth = await Pinjaman.create({
        tanggal_peminjaman,
        keterangan,
        pinjaman,
        pegawai_id,
      });

      const addFirstMonthlyBorrowedMoney = await Pinjaman_Bulanan.create({
        total: pinjaman,
        bulan: tanggal_peminjaman,
        pegawai_id,
      });

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully borrow money...",
        data: [addFirstTimeBorrowMoneyThisMonth, addFirstMonthlyBorrowedMoney],
      });
    } else {
      const addBorrowedMoney = await Pinjaman.create({
        tanggal_peminjaman,
        keterangan,
        pinjaman,
        pegawai_id,
      });

      const getSumPinjaman = await Pinjaman.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("pinjaman")), "total"]],
        where: {
          [Op.and]: [
            {
              pegawai_id,
            },
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("tanggal_peminjaman")),
              getYear
            ),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("tanggal_peminjaman")),
              getMonth
            ),
          ],
        },
      });

      const stringify = JSON.stringify(getSumPinjaman);
      const parse = JSON.parse(stringify);
      const total = parse[0].total;

      const updateMonthlyBorrowedMoney = await Pinjaman_Bulanan.update(
        {
          total,
          bulan: tanggal_peminjaman,
        },
        {
          where: {
            [Op.and]: [
              {
                pegawai_id,
              },
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("bulan")),
                getYear
              ),
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("bulan")),
                getMonth
              ),
            ],
          },
        }
      );

      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully borrow money and update the total borrowed money...",
        data: [addBorrowedMoney, "Successfully update..."],
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getAllDataPinjaman = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman.findAll({
      include: [{ model: Pegawai }],
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data bulanan pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getAllMonthlyDataPinjaman = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman_Bulanan.findAll({
      include: [{ model: Pegawai }],
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data bulanan pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getDataPinjamanBasedOnMonthAndPegawaiId = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman.findAll({
      include: [{ model: Pegawai }],
      where: {
        [Op.and]: [
          { pegawai_id: req.params.id },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal_peminjaman")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal_peminjaman")),
            req.params.bulan
          ),
        ],
      },
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getDataMonthlyPinjamanBasedOnMonthAndPegawaiId = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman_Bulanan.findOne({
      include: [{ model: Pegawai }],
      where: {
        [Op.and]: [
          { pegawai_id: req.params.id },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("bulan")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("bulan")),
            req.params.bulan
          ),
        ],
      },
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data bulanan pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getAllDataPinjamanBasedOnMonth = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman.findAll({
      include: [{ model: Pegawai }],
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal_peminjaman")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal_peminjaman")),
            req.params.bulan
          ),
        ],
      },
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data bulanan pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

const getAllMonthlyDataPinjamanBasedOnMonth = async (req, res) => {
  try {
    const getDataPinjaman = await Pinjaman_Bulanan.findAll({
      include: [{ model: Pegawai }],
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("bulan")),
            req.params.tahun
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("bulan")),
            req.params.bulan
          ),
        ],
      },
    });

    res.status(200).send({
      statusCode: res.statusCode,
      msg: "Successfully get pinjaman data bulanan pegawai...",
      data: getDataPinjaman,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: res.statusCode,
      msg: "Something went wrong...",
      errorMsg: error.message,
      stack: error,
    });
  }
};

module.exports = {
  postDataPinjaman,
  getDataPinjamanBasedOnMonthAndPegawaiId,
  getDataMonthlyPinjamanBasedOnMonthAndPegawaiId,
  getAllDataPinjamanBasedOnMonth,
  getAllMonthlyDataPinjamanBasedOnMonth,
  getAllDataPinjaman,
  getAllMonthlyDataPinjaman,
};
