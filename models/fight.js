"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class fight extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			fight.belongsTo(models.user, {
				foreignKey: { name: "user_id" },
			});
			fight.hasMany(models.comment, {
				foreignKey: "fight_id",
			});
			fight.hasMany(models.users_fights_vote, {
				foreignKey: "fight_id",
			});
			user.belongsToMany(models.comment, {
				through: "users_comments_like",
				foreignKey: "user_id",
			});
		}
	}
	fight.init(
		{
			category: DataTypes.STRING,
			left: DataTypes.STRING,
			right: DataTypes.STRING,
			left_vote_count: { type: DataTypes.INTEGER, defaultValue: 0 },
			right_vote_count: DataTypes.INTEGER,
			visits: { type: DataTypes.INTEGER, defaultValue: 0 },
		},
		{
			sequelize,
			modelName: "fight",
		},
	);
	return fight;
};
