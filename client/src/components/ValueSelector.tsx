interface Props {
	children: number;
	padding: number;
	incrementValue: () => void;
	decrementValue: () => void;
}

function ValueSelector({
	children,
	padding,
	incrementValue,
	decrementValue,
}: Props) {
	return (
		<div>
			<button onClick={incrementValue}>▴</button>
			<div>{String(children).padStart(padding, "0")}</div>
			<button onClick={decrementValue}>▾</button>
		</div>
	);
}

export default ValueSelector;
