"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users_fights_votes", {
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
			fight_id: {
				type: Sequelize.INTEGER,
				references: { model: "fights", key: "id" },
			},
			vote_where: {
				type: Sequelize.STRING,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users_fights_votes");
	},
};
