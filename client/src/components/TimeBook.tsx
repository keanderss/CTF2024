import ValueSelector from "./ValueSelector";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { seededRandom } from "three/src/math/MathUtils.js";

function getElementAt<T>(arr: T[], index: number): T {
	return index >= 0 ? arr[index] : arr[arr.length + index];
}

const API_BASE_URL = "https://page-in-time-api.vercel.app";

function TimeBook() {
	const [time, setTime] = useState(new Date());
	const [year, setYear] = useState(time.getFullYear());
	const [month, setMonth] = useState(time.getMonth() + 1);
	const [DaTe, setDaTe] = useState(time.getDate());
	const [hour, setHour] = useState(time.getHours());
	const [minute, setMinute] = useState(time.getMinutes());
	const [second, setSecond] = useState(time.getSeconds());
	const [sync, setSync] = useState(true);
	const [page, setPage] = useState("");
	const [encrypted, setEncrypted] = useState("");
	const [problem, setProblem] = useState("");

	const writePage = (seed: number, lower: number, upper: number) => {
		let page = "";
		const mids = [" ", ", ", "-"];
		const ends = [". ", "! ", "? "];
		for (let i = lower; i < upper; i++) {
			let rand = seededRandom(seed + i);
			page += String.fromCharCode(rand * 26 + 65);
			for (let j = rand * 20 + 5; j > 0; j--) {
				for (let k = 0; k < rand * 8 + 2; k++) {
					page += String.fromCharCode(seededRandom(rand + j + k) * 26 + 97);
				}
				let type = Math.floor(seededRandom(rand + j) * 16);
				type > 2 ? (type = 0) : type;
				j > 1
					? (page += getElementAt(mids, type))
					: (page += getElementAt(ends, type));
			}
		}
		return page;
	};

	const decrypt = (key: string) => {
		let seed =
			year * 32140800 +
			(month - 1) * 2678400 +
			(DaTe - 1) * 86400 +
			hour * 3600 +
			minute * 60 +
			Math.floor(second / 10);
		let page = "";
		let length = 100;
		page += writePage(seed, 0, Math.floor(seededRandom(seed) * length));
		let p = "";
		try {
			p = CryptoJS.AES.decrypt(encrypted, CryptoJS.SHA256(key), {
				iv: CryptoJS.SHA1(key),
				mode: CryptoJS.mode.CBC,
			}).toString(CryptoJS.enc.Utf8);
		} catch {}
		p ? (page += `${p} `) : (page += problem);
		page += writePage(seed, Math.floor(seededRandom(seed) * length), length);
		return page;
	};

	const SyncTime = () => {
		setTime(new Date());
		setYear(time.getFullYear());
		setMonth(time.getMonth() + 1);
		setDaTe(time.getDate());
		setHour(time.getHours());
		setMinute(time.getMinutes());
		setSecond(time.getSeconds());
		const element = document.getElementById("page");
		if (element) {
			if (second % 10 === 9) {
				element.classList.add("bg-white");
				element.classList.remove("page");
			}
			if (second % 10 === 0) {
				element.classList.add("page");
				element.classList.remove("bg-white");
			}
		}
	};

	const isLeapYear = () => {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};

	const getMaxDays = (month: number) => {
		let maxDays = getElementAt(timeUnits.DaTe.maxValue, month - 1);
		if (month === 2 && isLeapYear()) {
			maxDays++;
		}
		return maxDays;
	};

	const adjustMaxDays = () => {
		let maxDays = getMaxDays(month);
		if (DaTe > maxDays) {
			setDaTe(maxDays);
		}
	};

	const timeUnits = {
		hour: {
			maxValue: 23,
			minValue: 0,
			nextUnit: "DaTe",
		},
		minute: {
			maxValue: 59,
			minValue: 0,
			nextUnit: "hour",
		},
		second: {
			maxValue: 59,
			minValue: 0,
			nextUnit: "minute",
		},
		DaTe: {
			maxValue: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			minValue: 1,
			nextUnit: "month",
		},
		month: {
			maxValue: 12,
			minValue: 1,
			nextUnit: "year",
		},
		year: {
			maxValue: Number.POSITIVE_INFINITY,
			minValue: Number.NEGATIVE_INFINITY,
			nextUnit: "year",
		},
	};

	const getMaxValue = (unit: timeUnit) => {
		if (unit === "DaTe") {
			return getMaxDays(month);
		}
		return timeUnits[unit].maxValue as number;
	};

	type timeUnit = "hour" | "minute" | "second" | "DaTe" | "month" | "year";

	const execTimeCase = (
		unit: timeUnit,
		inc: boolean,
		val: number,
		set: React.Dispatch<React.SetStateAction<number>>
	) => {
		inc
			? val === getMaxValue(unit)
				? (set(timeUnits[unit].minValue),
				  traverseTime(timeUnits[unit].nextUnit, true))
				: set(val + 1)
			: val === timeUnits[unit].minValue
			? (set(getMaxValue(unit)), traverseTime(timeUnits[unit].nextUnit, false))
			: set(val - 1);
	};

	const traverseTime = (unit: string, increment: boolean) => {
		setSync(false);
		switch (unit) {
			case "hour":
				execTimeCase(unit, increment, hour, setHour);
				break;
			case "minute":
				execTimeCase(unit, increment, minute, setMinute);
				break;

			case "second":
				execTimeCase(unit, increment, second, setSecond);
				break;

			case "DaTe":
				execTimeCase(unit, increment, DaTe, setDaTe);
				break;

			case "month":
				execTimeCase(unit, increment, month, setMonth);
				break;

			case "year":
				increment ? setYear(year + 1) : setYear(year - 1);
				break;
		}
		const element = document.getElementById("page");
		if (element) {
			element.classList.remove("bg-white");
			element.classList.remove("page");
		}
	};

	useEffect(() => {
		if (sync) {
			const intervalId = setInterval(SyncTime, 100);
			return () => clearInterval(intervalId);
		}
	});

	useEffect(() => {
		setPage(
			decrypt(
				`${hour}${minute}${Math.floor(second / 10)}${DaTe}${month}${year}`
			)
		);
	}, [hour, minute, second, DaTe, month, year]);

	useEffect(() => {
		adjustMaxDays();
	}, [month, year]);

	useEffect(() => {
		const fetchProblems = async () => {
			const response = await fetch(`${API_BASE_URL}/problems`);
			const problems = await response.json();
			const problem = problems.p0;
			const encrypted = problems.p1;
			setProblem(problem);
			setEncrypted(encrypted);
		};
		fetchProblems();
	}, []);

	return (
		<div className="flex-none font-dmsans font-normal">
			<div className="flex mx-auto p-1 flex-wrap justify-center">
				<div className="flex mx-2 p-1">
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("hour", true)}
						decrementValue={() => traverseTime("hour", false)}
					>
						{hour}
					</ValueSelector>
					<div className="my-auto">:</div>
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("minute", true)}
						decrementValue={() => traverseTime("minute", false)}
					>
						{minute}
					</ValueSelector>
					<div className="my-auto">:</div>
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("second", true)}
						decrementValue={() => traverseTime("second", false)}
					>
						{second}
					</ValueSelector>
				</div>
				<div className="flex mx-2 p-1">
					<button id="sync" onClick={() => setSync(true)}>
						Sync
					</button>
				</div>
				<div className="flex mx-2 p-1">
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("DaTe", true)}
						decrementValue={() => traverseTime("DaTe", false)}
					>
						{DaTe}
					</ValueSelector>
					<div className="my-auto">/</div>
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("month", true)}
						decrementValue={() => traverseTime("month", false)}
					>
						{month}
					</ValueSelector>
					<div className="my-auto">/</div>
					<ValueSelector
						padding={2}
						incrementValue={() => traverseTime("year", true)}
						decrementValue={() => traverseTime("year", false)}
					>
						{year}
					</ValueSelector>
				</div>
			</div>
			<div
				id="page"
				className="container max-w-xl p-1 mx-auto text-wrap text-justify overflow-clip leading-tight bg-white text-white min-h-screen"
			>
				{page}
			</div>
		</div>
	);
}

export default TimeBook;
