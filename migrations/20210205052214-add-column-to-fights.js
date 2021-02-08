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
		await queryInterface.addColumn("users", "is_social", {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
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
		await queryInterface.removeColumn("users", "is_social");
	},
};
