const { user } = require("../../models");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
	//특정 유저데이터 요청(마이페이지)
	//GET/users/:id
	get_user_data: async (req, res) => {
		res.send();
	},
	//회원가입
	//POST /users/signup
	sign_up: async (req, res) => {
		const { nickname, email, password } = req.body;
		if (nickname && email && password) {
			const conflictedEmail = await user.findOne({ where: { email } });
			const conflictedNick = await user.findOne({ where: { nickname } });
			console.log(conflictedEmail);
			if (!conflictedEmail && !conflictedNick) {
				const hashedPassword = crypto.PBKDF2(password, process.env.SALT, {
					keySize: 512 / 32,
					iterations: 123432,
				});
				await user.create({
					nickname,
					email,
					password: hashedPassword.toString(),
				});
				res.status(200).end();
			} else {
				res
					.status(409)
					.json({ message: "This email or nickname already exists" });
			}
		} else {
			res.status(400).json({ message: "invalid input" });
		}
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
