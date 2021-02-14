const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const main = require("./router");
const morgan = require("morgan");
const fight_and_comment_router = require("./router/fightAndComment");
const user_router = require("./router/user");

const PORT = 4000;

//server기준으로 html위치 선정
server.set("views", "router");
//화면엔진을 ejs로 설정
server.set("view engine", "ejs");
server.engine("html", require("ejs").renderFile);

server.use(
	cors({
		origin: ["https://www.nugathesam.com"],
		methods: ["GET", "POST", "PUT", "OPTIONS"],
	}),
);
server.use(bodyParser.json());

server.use(morgan("dev"));

//api 메인페이지
server.use("/", main);
//fight와 댓글 라우터
server.use("/fights", fight_and_comment_router);
//user라우터
server.use("/users", user_router);

server.listen(PORT, () => {
	console.log("server on 4000");
});
