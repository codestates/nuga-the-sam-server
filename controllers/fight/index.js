const { fight, comment } = require("../../models");
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
		if (req.headers.authorization) {
			jwt.verify(
				accessToken,
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						//토큰이 유효하지않은 경우
						//해당fight내용과 특정fight에 해당하는 comments를준다.
						//상태코드는 205
						const result = await fight.findOne({
							where: { id: req.params.fight_id },
						});
						const comments = await comment.findOne({
							where: { fight_id: req.params.fight_id },
						});
						res.status(205).json({ ...result, comments });
					} else {
						//토큰이 유효한경우
					}
				},
			);
		} else {
			//토큰이 없는경우
			//해당fight게시글과 특정fight에 해당하는 comments를준다.
			//상태코드는 205
			const result = await fight.findOne({
				where: { id: req.params.fight_id },
			});
			const comments = await comment.findOne({
				where: { fight_id: req.params.fight_id },
			});
			res.status(205).json({ ...result, comments });
		}

		res.send();
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
		res.send();
	},
	//우측에다 투표
	//PUT/fights/:fight_id/right_vote
	put_vote_right: async (req, res) => {
		res.send();
	},
	//유저가 투표했는지 여부를 확인
	//GET/fights/:fight_id/is_vote
	get_isVote: async (req, res) => {
		res.send();
	},
};
