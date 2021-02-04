const express = require("express");
const router = express.Router();
const controller = require("../controllers/fight");

router.get("/", controller.get_fights);
module.exports = router;
