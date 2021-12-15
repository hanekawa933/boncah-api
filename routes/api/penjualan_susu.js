const express = require("express");
const router = express.Router();
const {
  postPenjualanSusu,
  getDataPenjualan,
  getDataPenjualanByMonth,
  getDataPenjualanByMonthAndJenisSusu,
  getDataPenjualanByMonthDateAndJenisSusu,
  getDataPenjualanByMonthAndDate,
} = require("../../controllers/penjualan_susu");

router.post("/", postPenjualanSusu);

// router.post("/", postPenjualanSusu);
// router.get("/", getDataPenjualan);
// router.get("/perbulan/year=:tahun&month=:bulan", getDataPenjualanByMonth);
// router.get(
//   "/perbulan/year=:tahun&month=:bulan/:jenis_susu",
//   getDataPenjualanByMonthAndJenisSusu
// );
// router.get(
//   "/harian/year=:tahun&month=:bulan&date=:tanggal",
//   getDataPenjualanByMonthAndDate
// );
// router.get(
//   "/harian/year=:tahun&month=:bulan&date=:tanggal/:jenis_susu",
//   getDataPenjualanByMonthDateAndJenisSusu
// );

module.exports = router;
