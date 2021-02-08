"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class comment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			comment.belongsTo(models.user, {
				foreignKey: { name: "user_id" },
			});
			comment.belongsTo(models.fight, {
				foreignKey: { name: "fight_id" },
			});
			comment.belongsToMany(models.user, {
				through: "users_comments_like",
				foreignKey: "comment_id",
			});
		}
	}
	comment.init(
		{
			text: DataTypes.STRING,
			like_count: { type: DataTypes.INTEGER, defaultValue: 0 },
		},
		{
			sequelize,
			modelName: "comment",
		},
	);
	return comment;
};
