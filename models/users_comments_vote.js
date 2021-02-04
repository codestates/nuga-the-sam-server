"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class users_comments_vote extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	users_comments_vote.init(
		{
			vote_where: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "users_comments_vote",
		},
	);
	return users_comments_vote;
};
