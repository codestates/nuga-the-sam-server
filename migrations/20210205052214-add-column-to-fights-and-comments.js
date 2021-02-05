"use strict";

const { sequelize } = require("../models");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.addColumn("fights", "visits", {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		});
		await queryInterface.addColumn("comments", "side", {
			type: Sequelize.STRING,
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn("fights", "visits");
		await queryInterface.removeColumn("comments", "side");
	},
};
