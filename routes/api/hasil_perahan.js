const express = require("express");
const router = express.Router();

const {
  postHasilPerahan,
  getHasilPerahanUntillToday,
} = require("../../controllers/hasil_perahan");

router.post("/", postHasilPerahan);
router.get("/total/this_month", getHasilPerahanUntillToday);

module.exports = router;
