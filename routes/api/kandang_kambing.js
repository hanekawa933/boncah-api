const express = require("express");
const router = express.Router();

const {
  postKandangKambing,
  getAllKandangKambing,
  getKandangKambingById,
} = require("../../controllers/kandang_kambing");

router.post("/", postKandangKambing);
router.get("/", getAllKandangKambing);
router.get("/:id", getKandangKambingById);

module.exports = router;
