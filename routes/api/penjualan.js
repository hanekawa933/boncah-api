const express = require("express");
const router = express.Router();

const {
  getPenjualanUntillToday,
  getTotalPenjualanSumBasedOnQuery,
} = require("../../controllers/penjualan");

// router.post("/", postHasilPerahan);
router.get("/total/this_month", getPenjualanUntillToday);
router.get("/total", getTotalPenjualanSumBasedOnQuery);

module.exports = router;
