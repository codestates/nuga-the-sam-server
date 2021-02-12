require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		dialect: "mysql",
		dialectOptions: {
			useUTC: false, //for reading from database
			dateStrings: true,
			typeCast: function (field, next) {
				// for reading from database
				if (field.type === "DATETIME") {
					return field.string();
				}
				return next();
			},
		},
		timezone: "+09:00",
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		dialectOptions: {
			useUTC: false, //for reading from database
			dateStrings: true,
			typeCast: function (field, next) {
				// for reading from database
				if (field.type === "DATETIME") {
					return field.string();
				}
				return next();
			},
		},
		timezone: "+09:00",
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		dialectOptions: {
			useUTC: false, //for reading from database
			dateStrings: true,
			typeCast: function (field, next) {
				// for reading from database
				if (field.type === "DATETIME") {
					return field.string();
				}
				return next();
			},
		},
		timezone: "+09:00",
	},
};
