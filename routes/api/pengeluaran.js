const express = require("express");

const router = express.Router();
const {
  postPengeluaran,
  getDataKategori,
  getPengeluaranBasedOnQuery,
} = require("../../controllers/pengeluaran");

router.post("/", postPengeluaran);
router.get("/kategori", getDataKategori);
router.get("/report", getPengeluaranBasedOnQuery);

module.exports = router;
