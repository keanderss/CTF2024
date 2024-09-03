const CryptoJS = require("crypto-js");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const problem0 = "PLACEHOLDER 1";
const plaintext = "PLACEHOLDER 2";
const solution = 0;
const flag = "PLACEHOLDER 3";
const keydata = "000110";

const key = CryptoJS.SHA256(keydata);
const iv = CryptoJS.SHA1(keydata);
const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
	iv: iv,
	mode: CryptoJS.mode.CBC,
}).toString();

app.use(express.json());

app.use(
	cors({
		origin: "https://page-in-time.vercel.app",
		methods: ["GET", "POST"],
	})
);

app.use("*", (req, _res, next) => {
	console.log(req.method, req.params[0], req.body);
	next();
});

app.get("/problems", (_req, res) => {
	const problems = {
		p0: problem0,
		p1: encrypted,
	};
	res.status(200).send(problems);
});

app.post("/solutions", (req, res) => {
	const body = req.body;
	const name = body.name;
	const sum = body.sum;
	if (sum == solution && name != "") {
		const response = {
			SUBJECT: name.toUpperCase(),
			STATUS: "FURTHER EVALUATION PENDING",
			FLAG: flag,
		};
		console.log(`SOLVER: ${JSON.stringify(response)}`);
		res.status(200).send(response);
	} else {
		res.status(400).send();
	}
});

app.listen(port, console.log(`Listening on port ${port}`));

module.exports = app;
