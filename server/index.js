const CryptoJS = require("crypto-js");
const express = require("express");
const { z } = require("zod");
const cors = require("cors");
const app = express();
const port = 3000;
const solution =
	"a8c92acbf0cfdfdd08f3de4d1174760e371ed3ff817dfef0b56a78d40bbc425d";
const flag = "date_flag{_4w41t1ng_4551gnm3nt5_}";
const plaintexts = [
	{
		plaintext: "Nwwuhhh Nbszuhzmtr Nwuhhwhhwu, Nww Nwww Nwwww, Nw zc Nn. ",
		keydata: "bf2099287614864a1061b56645aa184f",
	},
	{
		plaintext:
			"RmRzIG9xbmFrZGxyPyBPbnJzIHJua3RzaG5tciEgbXpsZDogcm5rdWRxX216bGQsIGN6c3o6IFJHWkJCS1VIKEFubmouZmRzT3pmZChnLGwscixDLEwsWCkpIA==Zz1XV0hISCxsPUtIVyxyPUtIVyxDPVdXV0gsTD1XSEgsWD1MWldfSE1TIA== ",
		keydata: "2041030103717",
	},
];

let problems = [];

plaintexts.forEach((p) => {
	let problem = CryptoJS.AES.encrypt(p.plaintext, CryptoJS.SHA256(p.keydata), {
		iv: CryptoJS.SHA1(p.keydata),
		mode: CryptoJS.mode.CBC,
	}).toString();
	problems = [...problems, problem];
});

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
	res.status(200).send(problems);
});

const solver = z
	.object({
		name: z.string().toUpperCase().min(1),
		data: z.string().toLowerCase(),
	})
	.strict()
	.required();

app.post("/solutions", (req, res) => {
	const validationResult = solver.safeParse(req.body);
	if (validationResult.success && validationResult.data.data == solution) {
		const response = {
			SUBJECT: validationResult.data.name,
			STATUS: "FURTHER EVALUATION PENDING",
			FLAG: flag,
		};
		console.log(`SOLVER: ${JSON.stringify(response)}`);
		res.status(200).send(response);
	}
	if (validationResult.error) {
		console.log(validationResult.error?.format()._errors);
	}
	res.status(401).send();
});

app.listen(port, console.log(`Listening on port ${port}`));

module.exports = app;
