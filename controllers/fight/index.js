const {
	user,
	fight,
	comment,
	users_fights_vote,
	users_comments_like,
} = require("../../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
	get_fights: async (req, res) => {
		const results = await fight.findAll();
		res.send(results);
	},
	//새로운 fight 작성
	//POST/ fights
	post_fight: async (req, res) => {
		const { left, right, category } = req.body;
		if (left && right) {
			if (req.headers.authorization) {
				const accessToken = req.headers.authorization.split(" ")[1];
				jwt.verify(
					accessToken,
					process.env.ACCESS_SECRET,
					async (err, decoded) => {
						if (err) {
							res.status(403).json({ message: "invalid token" });
						} else {
							const user_id = decoded.id;
							const newFight = await fight.create({
								user_id,
								left,
								right,
								category,
							});
							res.status(201).json(newFight);
						}
					},
				);
			} else {
				res.status(403).json({ message: "invalid token" });
			}
		} else {
			res.status(400).json({ message: "invalid input" });
		}
	},
	//url 파라미터를 받아서 특정 fight만 보내줌
	//GET/fights/:fight_id
	get_fight: async (req, res) => {
		//토큰이 있는경우
		console.log(req.headers.authorization);
		if (req.headers.authorization) {
			console.log(req.headers.authorization);
			const accessToken = req.headers.authorization.split(" ")[1];
			jwt.verify(
				accessToken,
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						//토큰이 유효하지않은 경우
						//해당fight내용과 특정fight에 해당하는 comments를준다.
						//상태코드는 205
						const result = await fight.findOne({
							include: [
								{
									model: user,
									attributes: ["nickname"],
								},
							],
							where: { id: req.params.fight_id },
						});
						console.log(1);
						const comments = await comment.findAll({
							include: [
								{
									model: user,
									attributes: ["nickname"],
								},
							],
							where: { fight_id: req.params.fight_id },
						});
						console.log(2);
						result.visits++;
						await result.save();
						res.status(205).json({
							id: result.id,
							category: result.category,
							left: result.left,
							right: result.right,
							left_vote_count: result.left_vote_count,
							right_vote_count: result.right_vote_count,
							visits: result.visits,
							createdAt: result.createdAt,
							nickname: result.user.nickname,
							comments,
						});
					} else {
						//토큰이 유효한경우
						//유저가 어디에 투표를 했는지 데이터를 불러온다.(left인지 right인지)
						const vote_where = await users_fights_vote.findOne({
							where: { user_id: tokenData.id, fight_id: req.params.fight_id },
						});
						console.log(3);
						//파라미터에 해당하는 fight와 user이름의 join값을 불러온다.
						const paramFight = await fight.findOne({
							include: [
								{
									model: user,
									attributes: ["nickname"],
								},
							],
							where: { id: req.params.fight_id },
						});
						console.log(4);
						//fight_id에 해당하는 comments를 불러온다
						//
						const comments = await comment.findAll({
							where: { fight_id: req.params.fight_id },
							include: [
								{
									model: user,
									attributes: ["nickname"],
								},
							],
						});
						console.log("4 - 1");
						const resComments = await Promise.all(
							comments.map(async (elComment) => {
								const isLike = await users_comments_like.findOne({
									where: { comment_id: elComment.id, user_id: tokenData.id },
								});
								if (isLike) {
									return {
										id: elComment.id,
										text: elComment.text,
										side: elComment.side,
										like_count: elComment.like_count,
										createdAt: elComment.createdAt,
										user: { nickname: elComment.user.nickname },
										isLike: true,
									};
								} else {
									return {
										id: elComment.id,
										text: elComment.text,
										side: elComment.side,
										like_count: elComment.like_count,
										createdAt: elComment.createdAt,
										user: { nickname: elComment.user.nickname },
										isLike: false,
									};
								}
							}),
						);
						console.log(resComments, 5);
						paramFight.visits++;
						await paramFight.save();
						res.status(200).json({
							id: paramFight.id,
							category: paramFight.category,
							left: paramFight.left,
							right: paramFight.right,
							left_vote_count: paramFight.left_vote_count,
							right_vote_count: paramFight.right_vote_count,
							visits: paramFight.visits,
							createdAt: paramFight.createdAt,
							nickname: paramFight.user.nickname,
							comments: resComments,
							vote_where: vote_where ? vote_where.vote_where : null,
						});
					}
				},
			);
		} else {
			//토큰이 없는경우
			//해당fight게시글과 특정fight에 해당하는 comments를준다.
			//상태코드는 205
			console.log(6);
			const result = await fight.findOne({
				include: [
					{
						model: user,
						attributes: ["nickname"],
					},
				],
				where: { id: req.params.fight_id },
			});
			console.log(7);
			const comments = await comment.findAll({
				include: [
					{
						model: user,
						attributes: ["nickname"],
					},
				],
				where: { fight_id: req.params.fight_id },
			});
			console.log(8);
			result.visits++;
			await result.save();
			res.status(205).json({
				id: result.id,
				category: result.category,
				left: result.left,
				right: result.right,
				left_vote_count: result.left_vote_count,
				right_vote_count: result.right_vote_count,
				visits: result.visits,
				createdAt: result.createdAt,
				nickname: result.user.nickname,
				comments,
			});
		}
	},
	//특정 카테고리에 해당하는 fight만 보내줌
	//GET/fights/category/:category
	get_category: async (req, res) => {
		const results = await fight.findAll({
			where: { category: decodeURI(req.params.category) },
		});
		res.send(results);
	},
	//좌측에다 투표
	//PUT/fights/:fight_id/left_vote
	put_vote_left: async (req, res) => {
		if (req.headers.authorization) {
			console.log("put_vote_left-1");
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						console.log("put_vote_left-2");
						res.status(403).json({ message: "invalid token" });
					} else {
						console.log("put_vote_left-3");
						const isVote = await users_fights_vote.findOne({
							where: { user_id: tokenData.id, fight_id: req.params.fight_id },
						});
						console.log(isVote, "put_vote_left-4");
						if (isVote) {
							res.status(409).json({ message: "aleady voted" });
						} else {
							const voteFight = await fight.findOne({
								where: { id: req.params.fight_id },
							});
							console.log(voteFight, "put_vote_left-5");
							voteFight.left_vote_count++;
							await voteFight.save();
							const voteLog = await users_fights_vote.create({
								user_id: tokenData.id,
								fight_id: req.params.fight_id,
								vote_where: "left",
							});
							console.log(voteLog, "put_vote_left-6");
							res.status(201).end();
						}
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
	//우측에다 투표
	//PUT/fights/:fight_id/right_vote
	put_vote_right: async (req, res) => {
		if (req.headers.authorization) {
			console.log("put_vote_right-1");
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						console.log("put_vote_right-2");
						res.status(403).json({ message: "invalid token" });
					} else {
						console.log("put_vote_right-3");
						const isVote = await users_fights_vote.findOne({
							where: { user_id: tokenData.id, fight_id: req.params.fight_id },
						});
						console.log(isVote, "put_vote_right-4");
						if (isVote) {
							res.status(409).json({ message: "aleady voted" });
						} else {
							const voteFight = await fight.findOne({
								where: { id: req.params.fight_id },
							});
							console.log(voteFight, "put_vote_right-5");
							voteFight.right_vote_count++;
							await voteFight.save();
							const voteLog = await users_fights_vote.create({
								user_id: tokenData.id,
								fight_id: req.params.fight_id,
								vote_where: "right",
							});
							console.log(voteLog, "put_vote_right-6");
							res.status(201).end();
						}
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
};
