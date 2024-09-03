import { useFrame } from "@react-three/fiber";
import { useState } from "react";

interface Star {
	x: number;
	y: number;
	z: number;
	length: number;
}

function generateStars(numStars: number): Star[] {
	const stars: Star[] = [];

	for (let i = 1; i <= numStars; i++) {
		const angle = Math.PI * 2 * (i / numStars);
		const z = i / numStars;
		const xSign = i % 4 > i % 2 ? 1 : -1;
		const ySign = i % 2 === 0 ? 1 : -1;
		const star: Star = {
			x: xSign * Math.cos(angle - xSign * 0.1 * (i % 4)),
			y: ySign * Math.sin(angle - ySign * 0.1 * (i % 4)),
			z: z * 5,
			length: z,
		};
		stars.push(star);
	}

	return stars;
}

function Stars() {
	const [stars, setStars] = useState<Star[]>(generateStars(48));

	useFrame(() => {
		setStars((prevStars) =>
			prevStars.map((star) => ({
				...star,
				z: star.z + 0.005 > 5 ? 0 : star.z + 0.005,
			}))
		);
	});

	return (
		<>
			{stars.map((star, index) => (
				<mesh key={index} position={[star.x, star.y, star.z]}>
					<boxGeometry args={[0.005, 0.005, 0.2]} />
					<meshBasicMaterial color={"#ffffff"} />
				</mesh>
			))}
		</>
	);
}

export default Stars;
