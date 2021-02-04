"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("fights", {
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
			category: {
				type: Sequelize.STRING,
			},
			left: {
				type: Sequelize.STRING,
			},
			right: {
				type: Sequelize.STRING,
			},
			left_vote_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			right_vote_count: {
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
		await queryInterface.dropTable("fights");
	},
};
