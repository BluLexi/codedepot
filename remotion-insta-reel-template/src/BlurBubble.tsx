import React, { useEffect, useState } from 'react';

const BlurBubble = () => {
	// The state for the bubble's current position index
	const [index, setIndex] = useState(0);

	// Define the four fixed positions
	const positions = [
		{ top: '10%', left: '20%' },
		{ top: '60%', left: '40%' },
		{ top: '30%', left: '80%' },
		{ top: '70%', left: '10%' },
		{ top: '50%', left: '50%' },
		{ top: '80%', left: '20%' },
		{ top: '20%', left: '70%' },
		{ top: '20%', left: '30%' },
		{ top: '30%', left: '10%' },
		{ top: '10%', left: '20%' },
		{ top: '60%', left: '40%' },
		{ top: '30%', left: '80%' },
		{ top: '70%', left: '10%' },
		{ top: '50%', left: '50%' },
		{ top: '80%', left: '20%' },
		{ top: '20%', left: '70%' },
		{ top: '20%', left: '30%' },
		{ top: '30%', left: '10%' },
		{ top: '10%', left: '20%' },
		{ top: '60%', left: '40%' },
		{ top: '30%', left: '80%' },
		{ top: '70%', left: '10%' },
		{ top: '50%', left: '50%' },
		{ top: '80%', left: '20%' },
		{ top: '20%', left: '70%' },
		{ top: '20%', left: '30%' },
		{ top: '30%', left: '10%' },
		{ top: '10%', left: '20%' },
		{ top: '60%', left: '40%' },
		{ top: '30%', left: '80%' },
		{ top: '70%', left: '10%' },
		{ top: '50%', left: '50%' },
		{ top: '80%', left: '20%' },
		{ top: '20%', left: '70%' },
		{ top: '20%', left: '30%' },
		{ top: '30%', left: '10%' },
		{ top: '10%', left: '20%' },
		{ top: '60%', left: '40%' },
		{ top: '30%', left: '80%' },
		{ top: '70%', left: '10%' },
		{ top: '50%', left: '50%' },
		{ top: '80%', left: '20%' },
		{ top: '20%', left: '70%' },
		{ top: '20%', left: '30%' },
		{ top: '30%', left: '10%' },
	].slice(0, 30);

	// Move bubble to the next position every 3 seconds
	useEffect(() => {
		const intervalId = setInterval(() => {
			setIndex((currentIndex) => (currentIndex + 1) % positions.length);
		}, 20000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div
			style={{
				position: 'absolute',
				width: '400px', // size of the bubble
				height: '400px',
				borderRadius: '100%',
				background: 'rgba(26,41,87, 0.4)', // semi-transparent white
				filter: 'blur(100px)',
				transition: 'top 80s linear, left 80s linear', // Transition for smooth movement
				zIndex: 9,
				...positions[index],
			}}
		/>
	);
};

export default BlurBubble;
