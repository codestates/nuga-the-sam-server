"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class users_comments_like extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	users_comments_like.init(
		{},
		{
			sequelize,
			modelName: "users_comments_like",
		},
	);
	return users_comments_like;
};
