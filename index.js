const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./router");
const morgan = require("morgan");

const PORT = 4000;

//server기준으로 html위치 선정
server.set("views", "router");
//화면엔진을 ejs로 설정
server.set("view engine", "ejs");
server.engine("html", require("ejs").renderFile);

server.use(cors());
server.use(bodyParser.json());

server.use(morgan("dev"));

server.use("/", router);

server.listen(PORT, () => {
	console.log("server on 4000");
});
