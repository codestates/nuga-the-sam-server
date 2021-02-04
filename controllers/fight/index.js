const { fight } = require("../../models");

module.exports = {
	get_fights: async (req, res) => {
		const results = await fight.findAll();
		res.send(results);
	},
};
