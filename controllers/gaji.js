const { Gaji, Pinjaman_Bulanan, Pegawai } = require("../models/model");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const postDataGaji = async (req, res) => {
  const { gaji, lembur, tanggal, keterangan, pegawai_id } = req.body;

  try {
    const getMonth = new Date(tanggal).getMonth() + 1;
    const getFullYear = new Date(tanggal).getUTCFullYear();

    const monthlyWorkerBorrowedMoney = await Pinjaman_Bulanan.findOne({
      where: {
        [Op.and]: [
          { pegawai_id },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("bulan")),
            getFullYear
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("bulan")),
            getMonth
          ),
        ],
      },
    });

    const isPegawaiAlreadyHaveSalaryInThisMonth = await Gaji.findOne({
      where: {
        [Op.and]: [
          { pegawai_id },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("tanggal")),
            getFullYear
          ),
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("tanggal")),
            getMonth
          ),
        ],
      },
    });

    if (monthlyWorkerBorrowedMoney) {
      if (!isPegawaiAlreadyHaveSalaryInThisMonth) {
        const totalSalary = gaji - monthlyWorkerBorrowedMoney.total + lembur;

        console.log(monthlyWorkerBorrowedMoney.total);

        const monthlyWorkerSalary = await Gaji.create({
          gaji,
          lembur,
          total: totalSalary,
          tanggal,
          keterangan,
          pegawai_id,
          pinjaman_bulanan_id: monthlyWorkerBorrowedMoney.id,
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Gaji successfully created...",
          data: monthlyWorkerSalary,
        });
      } else {
        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Pegawai already have gaji in this month...",
        });
      }
    } else {
      if (!isPegawaiAlreadyHaveSalaryInThisMonth) {
        const createMonthlyWorkerBorrowedMoney = await Pinjaman_Bulanan.create({
          total: 0,
          bulan: tanggal,
          pegawai_id,
        });

        const monthlyWorkerBorrowedMoney = await Pinjaman_Bulanan.findOne({
          where: {
            [Op.and]: [
              { pegawai_id },
              sequelize.where(
                sequelize.fn("YEAR", sequelize.col("bulan")),
                getFullYear
              ),
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("bulan")),
                getMonth
              ),
            ],
          },
        });

        const totalSalary = gaji - monthlyWorkerBorrowedMoney.total + lembur;

        const monthlyWorkerSalary = await Gaji.create({
          gaji,
          lembur,
          total: totalSalary,
          tanggal,
          keterangan,
          pegawai_id,
          pinjaman_bulanan_id: monthlyWorkerBorrowedMoney.id,
        });

        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Gaji successfully created...",
          data: monthlyWorkerSalary,
        });
      } else {
        res.status(200).send({
          statusCode: res.statusCode,
          msg: "Pegawai already have gaji in this month...",
        });
      }
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

const getAllDataGajiPegawaiByMonth = async (req, res) => {
  try {
    const getDataGaji = await Gaji.findAll({
      include: [{ model: Pegawai }, { model: Pinjaman_Bulanan }],
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

    if (getDataGaji.length > 0) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data gaji...",
        data: getDataGaji,
      });
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "No data gaji found within that month...",
        data: getDataGaji,
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

const getAllDataGajiPegawaiByMonthAndPegawaiId = async (req, res) => {
  try {
    const getDataGaji = await Gaji.findAll({
      include: [{ model: Pegawai }, { model: Pinjaman_Bulanan }],
      where: {
        [Op.and]: [
          { pegawai_id: req.params.id },
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

    if (getDataGaji.length > 0) {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "Successfully get data gaji...",
        data: getDataGaji,
      });
    } else {
      res.status(200).send({
        statusCode: res.statusCode,
        msg: "No data gaji found within that month...",
        data: getDataGaji,
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

module.exports = {
  postDataGaji,
  getAllDataGajiPegawaiByMonth,
  getAllDataGajiPegawaiByMonthAndPegawaiId,
};
