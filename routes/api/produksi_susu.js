const express = require("express");
const router = express.Router();

const { postProduksiSusu } = require("../../controllers/produksi_susu");

router.post("/", postProduksiSusu);

module.exports = router;
