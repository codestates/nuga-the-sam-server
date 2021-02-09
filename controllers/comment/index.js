const { comment, users_comments_like } = require("../../models");
const jwt = require("jsonwebtoken");
const user = require("../user");

module.exports = {
	//새로운 댓글 등록
	//POST/fights/:fight_id/comments
	post_comment: async (req, res) => {
		console.log(req.body);
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						const newComment = await comment.create({
							user_id: tokenData.id,
							fight_id: req.params.fight_id,
							text: req.body.text,
							side: req.body.side,
						});
						res.status(201).json(newComment);
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
	//댓글 수정
	//PUT/fights/:fight_id/comments/:comment_id/modify
	mod_comment: async (req, res) => {
		console.log(req.headers.authorization, 11111111111);
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						console.log(err, "err@#@#@##@#!@!##!#!##");
						res.status(403).json({ message: "invalid token" });
					} else {
						const modComment = await comment.findOne({
							where: { id: req.params.comment_id },
						});
						if (modComment.user_id === tokenData.id) {
							modComment.text = req.body.text;
							await modComment.save();
							res.status(200).end();
						} else {
							res.status(401).json({ messgae: "unauthorized" });
						}
						console.log(modComment, "!!!!!!!@@@@@@@@@");
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
		console.log(req.headers.authorization,1212121212121)
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						try {
							await comment.destroy({
								where: { id: req.params.comment_id, user_id: tokenData.id },
							});
							res.status(200).end();
						} catch {
							res.status(401).json({ message: "unauthorized" });
						}
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
	//댓글 추천
	//PUT/fights/:fight_id/comments/:comment_id/like
	like_comment: async (req, res) => {
		console.log(req.headers.authorization)
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						const isLike = await users_comments_like.findOne({
							where: {
								user_id: tokenData.id,
								comment_id: req.params.comment_id,
							},
						});
						if (isLike) {
							res.status(409).json({ message: "already like" });
						} else {
							await users_comments_like.create({
								user_id: tokenData.id,
								comment_id: req.params.comment_id,
							});
							const likeComment = await comment.findOne({
								where: { id: req.params.comment_id },
							});
							likeComment.like_count++;
							await likeComment.save();
							res.status(200).json();
						}
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
};
