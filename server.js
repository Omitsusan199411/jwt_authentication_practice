const express = require("express")
const app = express()
const PORT = 5000;
const auth = require("./routes/auth")
const post = require("./routes/post")

app.use(express.json()) // ミドルウェアの適用（expressがjson形式を受け付けるようにする）
app.use("/auth", auth);
app.use("/post", post)


app.listen(PORT, () => {
	console.log("サーバーを起動中・・・")
});

