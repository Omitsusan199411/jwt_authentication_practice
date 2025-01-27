const JWT = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	// JWTを持っているか確認 -> リクエストヘッダの中のx-auth-tokenを確認
	const token = req.header("x-auth-token");
	
	if(!token) {
		res.status(400).json([
			{
				message: "権限がありません。"
			}
		]);
	} else {

		try {
			let user = await JWT.verify(token, process.env.SECRET_KEY); // JWTトークンをデコード
			console.log(user);
			req.user = user.email;
			next(); // router.get("/private")の第二引数のコールバック関数を抜けて、第三引数のコールバック関数へ
		} catch {
			return res.status(400).json([
				{
					message: "トークンが一致しません"
				}
			])
		}
	}
}
