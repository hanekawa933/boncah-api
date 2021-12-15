const express = require("express");
const router = express.Router();

const {
  postDataPinjaman,
  getDataPinjamanBasedOnMonthAndPegawaiId,
  getDataMonthlyPinjamanBasedOnMonthAndPegawaiId,
  getAllDataPinjamanBasedOnMonth,
  getAllMonthlyDataPinjamanBasedOnMonth,
  getAllDataPinjaman,
  getAllMonthlyDataPinjaman,
} = require("../../controllers/pinjaman");

router.post("/", postDataPinjaman);

router.get("/lengkap", getAllDataPinjaman);

router.get("/perbulan", getAllMonthlyDataPinjaman);

router.get(
  "/lengkap/year=:tahun&month=:bulan/pegawai_id=:id",
  getDataPinjamanBasedOnMonthAndPegawaiId
);

router.get(
  "/perbulan/year=:tahun&month=:bulan/pegawai_id=:id",
  getDataMonthlyPinjamanBasedOnMonthAndPegawaiId
);

router.get("/lengkap/year=:tahun&month=:bulan", getAllDataPinjamanBasedOnMonth);

router.get(
  "/perbulan/year=:tahun&month=:bulan",
  getAllMonthlyDataPinjamanBasedOnMonth
);

module.exports = router;
