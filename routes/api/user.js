const express = require("express");
const router = express.Router();

const { postUser, userLogin, getUserLogin } = require("../../controllers/user");
const authentication = require("../../middleware/authentication");

const { validateSchema } = require("../../middleware/validator");
const { schemaLogin } = require("../../middleware/schemaObject");
router.post("/", postUser);
router.post("/login", validateSchema(schemaLogin), userLogin);
router.get("/user_login", authentication, getUserLogin);

module.exports = router;
