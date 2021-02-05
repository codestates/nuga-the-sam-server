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
					iterations: 32450,
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
		//email: req.body.email
		//password: req.body.password
		const { email, password } = req.body;
		if (email && password) {
			const hashedPassword = crypto.PBKDF2(password, process.env.SALT, {
				keySize: 512 / 32,
				iterations: 32450,
			});
			const result = await user.findOne({
				where: { email, password: hashedPassword.toString() },
			});
			if (result) {
				const token = jwt.sign(
					{
						id: result.id,
						nickname: result.nickname,
						email: result.email,
					},
					process.env.ACCESS_SECRET,
					{
						expiresIn: "1h",
					},
				);
				res.json({ token });
			} else {
				res.status(404).json({ message: "not found" });
			}
		} else {
			res.status(400).json({ message: "invalid input" });
		}
	},
	//로그아웃
	//POST /users/logout
	log_out: async (req, res) => {
		res.send();
	},
	//소셜로그인
	//POST /users/sociallogin
	social_login: async (req, res) => {
		res.send();
	},
	//소셜 회원가입
	//POST /users/socialsignup
	social_signup: async (req, res) => {
		res.send();
	},
	//이메일 중복확인
	//POST /users/signup/checkemail
	check_email: async (req, res) => {
		res.send();
	},
	//닉네임 중복황인
	//POST /users/signup/checknick
	check_nick: async (req, res) => {
		res.send();
	},
};
