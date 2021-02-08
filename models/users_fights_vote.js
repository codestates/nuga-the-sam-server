"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class users_fights_vote extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			users_fights_vote.belongsTo(models.user, {
				foreignKey: { name: "user_id" },
			});
			users_fights_vote.belongsTo(models.fight, {
				foreignKey: { name: "fight_id" },
			});
		}
	}
	users_fights_vote.init(
		{
			vote_where: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "users_fights_vote",
		},
	);
	return users_fights_vote;
};
