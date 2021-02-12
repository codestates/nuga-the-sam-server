require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		dialect: "mysql",
		timezone: "+09:00",
		pool: {
      			max: 5,
      			min: 0,
      			acquire: 30000,
      			idle: 10000,
    		},
    		define: {
      			// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
      			// This was true by default, but now is false by default
      			timestamps: false,
      			supportBigNumbers: true,
    		},
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
		timezone: "+09:00",
		pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000,
                },
                define: {
                        // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
                        // This was true by default, but now is false by default
                        timestamps: false,
                        supportBigNumbers: true,
                },
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "nuga-the-sam",
		host: process.env.DB_HOST,
                timezone: "+09:00",
                pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000,
                },
                define: {
                        // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
                        // This was true by default, but now is false by default
                        timestamps: false,
                        supportBigNumbers: true,
                },
	},
};
