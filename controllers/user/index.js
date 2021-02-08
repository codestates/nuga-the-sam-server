const { user, fight, comment } = require("../../models");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { token } = require("morgan");
require("dotenv").config();

module.exports = {
	//특정 유저데이터 요청(마이페이지)
	//GET/users
	get_user_data: async (req, res) => {
		//헤더를 까서 토큰을 뽑는다. 토큰도 깐다.
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						//토큰에 있는 유저아이디를 토대로 유저테이블에서 유저데이터를 찾는다.(findOne)
						const userData = await user.findOne({
							where: { id: tokenData.id },
						});
						if (userData) {
							//fights테이블에서 유저아이디에 해당하는 fight를 찾는다.(findAll)
							const fights = await fight.findAll({
								where: { user_id: tokenData.id },
							});
							//comments테이블에서 유저아이디에 해당하는 comment를 찾는다(findAll)
							const comments = await comment.findAll({
								where: { user_id: tokenData.id },
							});
							//유저의 닉네임과 created_at과 찾은 fights와 comments를 준다.
							res.status(200).json({
								nickname: userData.nickname,
								createdAt: userData.createdAt,
								fights,
								comments,
							});
						} else {
							res.status(404).json({ message: "Not Found" });
						}
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
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
			console.log(resultViaOAuthToken);
			console.log(1);
			//Access토큰을토대로 api서버에 유저의 데이터를요청을한다.
			const resultViaApi = await axios.get(
				"https://www.googleapis.com/oauth2/v2/userinfo",
				{
					headers: {
						Authorization: `Bearer ${resultViaOAuthToken.data.access_token}`,
					},
				},
			);
			console.log(2);
			console.log(resultViaApi);
			//데이터베이스에서 data의 이메일과 social이 true인값이 있으면,
			const resultViaFindUser = await user.findOne({
				where: { email: resultViaApi.data.id.toString(), is_social: true },
			});
			console.log(3);
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
					email: resultViaApi.data.id.toString(),
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
	//닉네임 중복확인
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
	//닉네임 변경
	//PUT /users/modify
	modify_nick: async (req, res) => {
		if (req.headers.authorization) {
			jwt.verify(
				req.headers.authorization.split(" ")[1],
				process.env.ACCESS_SECRET,
				async (err, tokenData) => {
					if (err) {
						res.status(403).json({ message: "invalid token" });
					} else {
						const result = user.findOne({ where: { id: tokenData.id } });
						result.nickname = req.body.nickname;
						await result.save();
						res.status(200).end();
					}
				},
			);
		} else {
			res.status(403).json({ message: "invalid token" });
		}
	},
};
