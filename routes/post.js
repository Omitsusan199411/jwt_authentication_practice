const router = require("express").Router()
const { publicPosts, privatePosts } = require("../db/post.js") 
require("dotenv").config();
const checkJWT = require("../middleware/checkJWT");

// 誰でも見れる記事のAPI
router.get("/public", (req, res) => {
	res.json(publicPosts);
});

// JWTを持っている人用のAPI
router.get("/private", checkJWT, (req, res) => {
	res.json(privatePosts)
})


module.exports = router
