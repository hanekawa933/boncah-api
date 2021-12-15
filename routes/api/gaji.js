const express = require("express");
const router = express.Router();

const {
  postDataGaji,
  getAllDataGajiPegawaiByMonth,
  getAllDataGajiPegawaiByMonthAndPegawaiId,
} = require("../../controllers/gaji");

router.post("/", postDataGaji);

router.get("/perbulan/year=:tahun&month=:bulan", getAllDataGajiPegawaiByMonth);

router.get(
  "/perbulan/pegawai_id=:id&year=:tahun&month=:bulan",
  getAllDataGajiPegawaiByMonthAndPegawaiId
);

module.exports = router;
