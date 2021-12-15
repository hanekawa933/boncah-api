const express = require("express");

const router = express.Router();
const {
  postPenjualanPupuk,
  getAllPenjualanPupuk,
  getPenjualanPupukById,
} = require("../../controllers/penjualan_pupuk");

router.post("/", postPenjualanPupuk);
router.get("/", getAllPenjualanPupuk);
router.get("/:id", getPenjualanPupukById);

module.exports = router;
