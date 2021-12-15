const express = require("express");
const router = express.Router();

const {
  getAllPenjualanUntillToday,
  postPenjualanPupuk,
  getYearlySumOfPenjualanPupuk,
  getMonthlySumOfPenjualanPupuk,
  getPenjualanBasedOnQuery,
  getPenjualanSumBasedOnQuery,
  updatePenjualanPupuk,
} = require("../../controllers/penjualan_pupuk");
const {
  getStockProduksiPupuk,
  postPupuk,
  getProduksiPupukUntillToday,
  getMonthlySumOfProduksiPupuk,
  getYearlySumOfProduksiPupuk,
  postDummyPP,
  getStockPupuk,
  getProduksiBasedOnQuery,
  getProduksiSumBasedOnQuery,
  updatePupuk,
} = require("../../controllers/produksi_pupuk");

router.put("/produksi/:id/update", updatePupuk);
router.put("/penjualan/:id/update", updatePenjualanPupuk);
router.post("/produksi", postPupuk);
router.post("/penjualan", postPenjualanPupuk);
// router.get("/produksi/total", getProduksiPupukUntillToday);
router.get("/penjualan/total/this_month", getAllPenjualanUntillToday);
router.get("/stock/total", getStockProduksiPupuk);
router.get("/stock", getStockPupuk);
router.get("/produksi/yearly", getYearlySumOfProduksiPupuk);
router.get("/produksi/monthly", getMonthlySumOfProduksiPupuk);
router.get("/penjualan/yearly", getYearlySumOfPenjualanPupuk);
router.get("/penjualan/monthly", getMonthlySumOfPenjualanPupuk);
router.get("/penjualan/report", getPenjualanBasedOnQuery);
router.get("/produksi/report", getProduksiBasedOnQuery);

router.get("/penjualan/total", getPenjualanSumBasedOnQuery);
router.get("/produksi/total", getProduksiSumBasedOnQuery);
module.exports = router;
