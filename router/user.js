const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user");

router.get("/:id", user_controller.get_user_data);
router.post("/signup", user_controller.sign_up);
router.post("/login", user_controller.log_in);
router.post("/logout", user_controller.log_out);

module.exports = router;
