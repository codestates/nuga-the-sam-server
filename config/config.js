require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		dialect: "mysql",		
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
	},
};
