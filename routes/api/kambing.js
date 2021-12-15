const express = require("express");
const router = express.Router();

const {
  postKambing,
  getAllKambing,
  getKambingById,
  getAllKambingNeeds,
} = require("../../controllers/kambing");

const {
  postKandangKambing,
  getSumOfKambing,
} = require("../../controllers/kandang_kambing");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.post("/", upload.single("kambing"), postKambing);
router.post("/kandang", postKandangKambing);
router.get("/", getAllKambing);
router.get("/:id", getKambingById);
router.get("/kandang", getAllKambingNeeds);
router.get("/jumlah_kambing", getSumOfKambing);

module.exports = router;
