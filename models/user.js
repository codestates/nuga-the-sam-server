"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			user.hasMany(models.fight, {
				foreignKey: "user_id",
			});
			user.hasMany(models.comment, {
				foreignKey: "user_id",
			});
			user.belongsToMany(models.fight, {
				through: "users_fights_votes",
				targetKey: "id",
				foreignKey: "user_id",
			});
			user.belongsToMany(models.comment, {
				through: "users_comments_votes",
				targetKey: "id",
				foreignKey: "user_id",
			});
		}
	}
	user.init(
		{
			password: DataTypes.STRING,
			nickname: DataTypes.STRING,
			email: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "user",
		},
	);
	return user;
};
