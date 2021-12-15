const express = require("express");

const router = express.Router();
const {
  postPupuk,
  getAllPupuk,
  getPupukById,
} = require("../../controllers/produksi_pupuk");

router.post("/", postPupuk);
router.get("/", getAllPupuk);
router.get("/:id", getPupukById);

module.exports = router;
