const router = require("express").Router()
const { body, validationResult } = require("express-validator")
const { User } = require("../db/user.js") 
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
 
router.get("/", (req, res) => {
	res.send("Hello Authjs")
})

// ユーザー新規登録用のAPI
router.post(
	"/register",
	// 1. バリデーションチェック
	body("email").isEmail(), body("password").isLength({ min: 6 }), async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);

	// Errorオブジェクトがある場合
	if (!errors.isEmpty()) {
		return res.status(400).json( { errors: errors.array() } );
	}

	// 2. DBにユーザーが存在しているか確認
	const userInfo = User.find((user) => user.email === email);

	if (userInfo) {
		return res.status(400).json([
			{
				message: "すでにそのユーザーは存在しています。"
			}
		]);
	};


	// 3. パスワードのハッシュ化
	let hashedPassword = await bcrypt.hash(password, 10);
	
	// 4. DBへの保存
	User.push({
		email,
		password: hashedPassword
	})

	// 5. クライアントへJWTの発行。鍵の指定のオプションがない場合は、HS256をデフォルトで使用する（共通鍵）
	const token = await JWT.sign(
		{
			email,
		},
		process.env.SECRET_KEY,
		{
			expiresIn: "24h",
		}
	);

	return res.json({
		token: token,
	});
});


// DBのユーザーを確認するAPI
router.get("/allUsers", (req, res) => {
	return res.json(User);
})



// ログイン用のAPI
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const user = User.find((user) => user.email === email );

	if (!user) {
		return res.status(400).json([
			{
				message: "そのユーザーは存在しません。"
			}
		]);
	}

	// パスワードの復号、照合
	const isMatch = await bcrypt.compare(password, user.password);
	
	if (!isMatch) {
		return res.status(400).json(
			[
				{
					message: "パスワードが一致しません。",
				}
			]
		)
	};

	const token = await JWT.sign(
		{
			email,
		},
		process.env.SECRET_KEY,
		{
			expiresIn: "24h",
		}
	);

	return res.json({
		token: token,
	});


})

module.exports = router
