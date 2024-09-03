import TimeBook from "./components/TimeBook.tsx";
import { Canvas } from "@react-three/fiber";
import Stars from "./components/Stars.tsx";

function App() {
	return (
		<>
			<div className="fixed h-screen w-screen bg-black -z-50">
				<Canvas>
					<Stars />
				</Canvas>
			</div>
			<div className="fixed min-h-screen min-w-screen big-fade z-50 w-full pointer-events-none" />
			<div className="min-h-screen flex flex-col text-center w-full transparent">
				<TimeBook />
			</div>
			<div className="h-60" />
		</>
	);
}

export default App;
