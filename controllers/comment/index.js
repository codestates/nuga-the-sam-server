const { comment } = require("../../models");
const jwt = require("jsonwebtoken");
const user = require("../user");

module.exports = {
	//새로운 댓글 등록
	//POST/fights/:fight_id/comments
	post_comment: async (req, res) => {
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						const newComment = await user.create({
							user_id: tokenData.id,
							fight_id: req.params.fight_id,
							comment,
						});
						res.stauts(201).json(newComment);
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
	//해당 fight의 댓글 불러오기
	//GET/fights/:fight_id/comments
	get_comments: async (req, res) => {
		res.send();
	},
	//댓글 수정
	//PUT/fights/:fight_id/comments/:comment_id/modify
	mod_comment: async (req, res) => {
		if (req.headers.authorization) {
			jwt.verify(
				req.header.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						console.log(err, "@#@#@##@#!@!##!#!##");
						res.status(403).json({ message: "invalid token" });
					} else {
						const modComment = await user.findone({
							where: { id: tokenData.id },
						});
						console.log(modComment, "!!!!!!!@@@@@@@@@");
						modComment.comment = req.body.comment;
						await result.save();
						res.status(200).end();
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
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
	// dislike_comment: async (req, res) => {
	// res.send();
	// },
};
