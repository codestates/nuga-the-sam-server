const { comment } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = {
	//새로운 댓글 등록
	//POST/fights/:fight_id/comments
	post_comment: async (req, res) => {
		res.send();
	},
	//해당 fight의 댓글 불러오기
	//GET/fights/:fight_id/comments
	get_comments: async (req, res) => {
		res.send();
	},
	//댓글 수정
	//PUT/fights/:fight_id/comments/:comment_id/modify
	mod_comment: async (req, res) => {
		res.send();
	},
	//댓글 삭제
	//PUT/fights/:fight_id/comments/:comment_id/delete
	del_comment: async (req, res) => {
		res.send();
	},
	//댓글 추천
	//PUT/fights/:fight_id/comments/:comment_id/like
	like_comment: async (req, res) => {
		res.send();
	},
	//댓글 비추
	//PUT/fights/:fight_id/comments/:comment_id/dislike
	unlike_comment: async (req, res) => {
		res.send();
	},
};
