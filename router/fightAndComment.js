const express = require("express");
const router = express.Router();
const fight_controller = require("../controllers/fight");
const comment_controller = require("../controllers/comment");
//fight 라우터
router.get("/", fight_controller.get_fights);
router.get("/:fight_id", fight_controller.get_fight);
router.get("/category/:category", fight_controller.get_category);
router.get("/:fight_id/is_vote", fight_controller.get_isVote);
router.post("/", fight_controller.post_fight);
router.put("/:fight_id/left_vote", fight_controller.put_vote_left);
router.put("/:fight_id/right_vote", fight_controller.put_vote_right);

//comment 라우터
router.get("/:fight_id/comments", comment_controller.get_comments);
router.post("/:fight_id/comments", comment_controller.post_comment);
router.put("/:fight_id/comments/modify", comment_controller.mod_comment);
router.put("/:fight_id/comments/delete", comment_controller.del_comment);
router.put(
	"/:fight_id/comments/:comment_id/like",
	comment_controller.like_comment,
);
router.put(
	"/:fight_id/comments/:comment_id/unlike",
	comment_controller.unlike_comment,
);
module.exports = router;
