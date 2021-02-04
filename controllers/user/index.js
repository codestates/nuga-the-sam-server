const { user } = require("../../models");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
	//특정 유저데이터 요청(마이페이지)
	//GET/users/:id
	get_user_data: async (req, res) => {
		res.send();
	},
	//회원가입
	//POST /users/signup
	sign_up: async (req, res) => {
		res.send();
	},
	//로그인
	//POST /users/login
	log_in: async (req, res) => {
		res.send();
	},
	//로그아웃
	//POST /users/logout
	log_out: async (req, res) => {
		res.send();
	},
};
