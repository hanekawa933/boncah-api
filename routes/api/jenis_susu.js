const express = require("express");
const {
  postJenisSusu,
  getAllJenisSusu,
} = require("../../controllers/jenis_susu");

const router = express.Router();

router.get("/", getAllJenisSusu);
router.post("/", postJenisSusu);

module.exports = router;
