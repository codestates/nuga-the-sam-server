const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./router");
const morgan = require("morgan");

const PORT = 4000;

server.use(cors());
server.use(bodyParser.json());

server.use(morgan("dev"));

server.use("/", router);

server.listen(PORT, () => {
	console.log("server on 4000");
});
