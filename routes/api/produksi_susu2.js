const express = require("express");
const router = express.Router();

const {
  postSusu,
  getAllSusu,
  getAllSusuBasedOnMonth,
  getAllSusuBasedOnMonthAndJenisSusu,
  getAllSusuBasedOnDateAndMonth,
  getAllSusuBasedOnDateMonthAndJenisSusu,
} = require("../../controllers/produksi_susu");

const { validateSusuHarian } = require("../../middleware/validator");

router.post("/", validateSusuHarian, postSusu);
router.get("/", getAllSusu);
router.get("/perbulan/:tahun/:bulan", getAllSusuBasedOnMonth);
router.get("/perhari/:tahun/:bulan/:tanggal", getAllSusuBasedOnDateAndMonth);
router.get(
  "/:jenis_susu/perbulan/:tahun/:bulan/:jenis_susu",
  getAllSusuBasedOnMonthAndJenisSusu
);
router.get(
  "/:jenis_susu/perhari/:tahun/:bulan/:tanggal",
  getAllSusuBasedOnDateMonthAndJenisSusu
);

module.exports = router;
