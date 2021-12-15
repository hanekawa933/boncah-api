const express = require("express");
const router = express.Router();

const {
  postHasilPerahan,
  getHasilPerahanUntillToday,
  postDummy,
  getYearlySumOfTotalPerasan,
  getMonthlySumOfTotalPerasan,
  getPerahanBasedOnQuery,
  getHasilPerahanSumBasedOnQuery,
  updateHasilPerahan,
} = require("../../controllers/hasil_perahan");
const {
  getAllPenjualanUntillToday,
  postPenjualanSusu,
  getMonthlySumOfPenjualanSusu,
  getYearlySumOfPenjualanSusu,
  getPenjualanBasedOnQuery,
  getPenjualanSumBasedOnQuery,
  updatePenjualanSusu,
} = require("../../controllers/penjualan_susu");
const {
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
} = require("../../controllers/produksi_susu");

const { getWaktuPemerahan } = require("../../controllers/waktu_pemerahan");
const { getDataKeterangan } = require("../../controllers/keterangan_pemerahan");

router.put("/produksi/:id/update", updateProduksiSusu);
router.put("/perahan/:id/update", updateHasilPerahan);
router.put("/penjualan/:id/update", updatePenjualanSusu);
router.post("/", postHasilPerahan);
router.post("/dummy", postDummy);
router.post("/produksi/dummy", postDummyPS);
router.post("/produksi", postProduksiSusu);
router.post("/perahan", postHasilPerahan);
router.post("/penjualan", postPenjualanSusu);
router.get("/waktu", getWaktuPemerahan);
router.get("/perahan/yearly", getYearlySumOfTotalPerasan);
router.get("/perahan/monthly", getMonthlySumOfTotalPerasan);
router.get("/produksi/yearly", getYearlySumOfProduksiSusu);
router.get("/produksi/monthly", getMonthlySumOfProduksiSusu);
router.get("/produksi/stock", getDataStockSusu);
router.get("/keterangan", getDataKeterangan);
router.get("/hasil_perahan/total/this_month", getHasilPerahanUntillToday);
router.get("/stock/total", getStockProduksiSusu);
router.get("/stock", getStockSusu);
// router.get("/produksi/total", getProduksiSusuUntillToday);
router.get("/penjualan/total/this_month", getAllPenjualanUntillToday);
router.get("/penjualan/yearly", getYearlySumOfPenjualanSusu);
router.get("/penjualan/monthly", getMonthlySumOfPenjualanSusu);
router.get("/penjualan/report", getPenjualanBasedOnQuery);
router.get("/produksi/report", getProduksiBasedOnQuery);
router.get("/perahan/report", getPerahanBasedOnQuery);

router.get("/perahan/total", getHasilPerahanSumBasedOnQuery);
router.get("/penjualan/total", getPenjualanSumBasedOnQuery);
router.get("/produksi/total", getProduksiSumBasedOnQuery);

module.exports = router;
