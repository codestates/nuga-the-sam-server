const { user } = require("../../models");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
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
				res.json({ token, nickname: result.nickname });
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
	//소셜로그인, 회원가입
	//POST /users/social
	social: async (req, res) => {
		//authorizationCode를 OAuth서버에다가 줘서 accessToken을 받아온다.
		try {
			const resultViaOAuthToken = await axios.post(
				`https://www.googleapis.com/oauth2/v4/token`,
				{
					client_id:
						"103482969021-9v5buae9qqmjb71n9geuprb73fe1c013.apps.googleusercontent.com",
					client_secret: process.env.CLIENT_SECRET,
					code: req.body.authorizationCode,
					grant_type: "authorization_code",
					redirect_uri: "http://localhost:3000/login",
				},
				{
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			);
			//Access토큰을토대로 api서버에 유저의 데이터를요청을한다.
			const resultViaApi = await axios.get(
				"https://www.googleapis.com/oauth2/v2/userinfo",
				{
					headers: {
						Authorization: `Bearer ${resultViaOAuthToken.data.accecc_token}`,
					},
				},
			);
			//데이터베이스에서 data의 이메일과 social이 true인값이 있으면,
			const resultViaFindUser = await user.findOne({
				where: { email: resultViaApi.data.email, is_social: true },
			});
			if (resultViaFindUser) {
				//그에 해당하는 데이터를 뽑아서 토큰으로 만들어서 전달해준다.
				const token = jwt.sign(
					{
						id: resultViaFindUser.id,
						nickname: resultViaFindUser.nickname,
						email: resultViaFindUser.email,
					},
					process.env.ACCESS_SECRET,
					{
						expiresIn: "1h",
					},
				);
				res.json({ token, nickname: resultViaFindUser.nickname });
				//없으면
			} else {
				//받아온 데이터를 기준으로 user테이블에 social true로 데이터에 등록한후,
				const resultViaCreateUser = await user.create({
					email,
					is_social: true,
				});
				resultViaCreateUser.nickname = `Guest${resultViaCreateUser.id}`;
				await resultViaCreateUser.save();
				//가입시킨 데이터를 기준으로 토큰을 만들어서 전달해준다.
				const token = jwt.sign(
					{
						id: resultViaCreateUser.id,
						nickname: resultViaCreateUser.nickname,
						email: resultViaCreateUser.email,
					},
					process.env.ACCESS_SECRET,
					{
						expiresIn: "1h",
					},
				);
				res.status(201).json({ token, nickname: resultViaCreateUser.nickname });
			}
		} catch {
			res.status(400).end();
		}
	},
	//이메일 중복확인
	//POST /users/signup/checkemail
	check_email: async (req, res) => {
		const check = await user.findOne({ where: { email: req.body.email } });
		if (check) {
			res.status(400).json({ message: "already exist email" });
		} else {
			res.status(200).end();
		}
	},
	//닉네임 중복황인
	//POST /users/signup/checknick
	check_nick: async (req, res) => {
		const check = await user.findOne({
			where: { nickname: req.body.nickname },
		});
		if (check) {
			res.status(400).json({ message: "already exist nickname" });
		} else {
			res.status(200).end();
		}
	},
};
