const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user");

router.get("/:id", user_controller.get_user_data);
router.post("/signup", user_controller.sign_up);
router.post("/signup/checkemail", user_controller.check_email);
router.post("/signup/checknick", user_controller.check_nick);
router.post("/login", user_controller.log_in);
router.post("/logout", user_controller.log_out);
router.post("/sociallogin", user_controller.social_login);
router.post("/socialsignup", user_controller.social_signup);

module.exports = router;
