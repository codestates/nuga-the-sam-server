"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("comments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				reference: {
					model: "users",
					key: "id",
				},
			},
			fight_id: {
				type: Sequelize.INTEGER,
				reference: {
					model: "fights",
					key: "id",
				},
			},
			text: {
				type: Sequelize.STRING,
			},
			like_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			dislike_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
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
		await queryInterface.dropTable("comments");
	},
};
