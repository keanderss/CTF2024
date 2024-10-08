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
		console.log(validationResult.error.format());
	}
	res.status(401).send();
});

hints = {
	packagejson: {
		"name": "example",
		"version": "1.0.0",
		"main": "index.js",
		"type": "module",
		"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1"
		},
		"keywords": [],
		"author": "",
		"license": "ISC",
		"description": "",
		"dependencies": {
			"crypto-js": "^4.2.0",
			"three": "^0.168.0"
		}
	},
	hints: [
		"The clock.svg needs some source code to run",
		"If I hid stuff too well then make sure to inspect everything",
		"The middle path is encoded in octals",
		"If typescript is too hard then try javascript",
		"You don't need it, but if you do need it for some reason, the p0key is bf2099287614864a1061b56645aa184f",
		"0b00010000 0o20 16 0x10",
		"Its a single conversion to get the correct DaTe and time",
		"Do we really need to sit here and click all day?",
		"What do those equals signs mean?",
		"a8c92a..."
	],
	api: ["/problems", "/solutions", "/hints"]
}


app.get("/hints", (_req, res) => {
	res.status(200).send(hints)
})

app.listen(port, console.log(`Listening on port ${port}`));

module.exports = app;
