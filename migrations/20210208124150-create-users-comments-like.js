"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users_comments_likes", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				references: { model: "users", key: "id" },
			},
			comment_id: {
				type: Sequelize.INTEGER,
				references: { model: "comments", key: "id" },
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users_comments_likes");
	},
};
