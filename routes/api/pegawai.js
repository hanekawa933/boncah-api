const express = require("express");
const router = express.Router();

const {
  postDataPegawai,
  postDataPegawai2,
} = require("../../controllers/pegawai");

router.post("/daftar", postDataPegawai);

module.exports = router;
