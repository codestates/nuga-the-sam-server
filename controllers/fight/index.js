const { fight } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = {
	get_fights: async (req, res) => {
		const results = await fight.findAll();
		res.send(results);
	},
	//새로운 fight 작성
	//POST/ fights
	post_fight: async (req, res) => {
		res.send();
	},
	//url 파라미터를 받아서 특정 fight만 보내줌
	//GET/fights/:fight_id
	get_fight: async (req, res) => {
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
