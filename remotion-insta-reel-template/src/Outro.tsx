import {
	AbsoluteFill,
	useVideoConfig,
	interpolate,
	useCurrentFrame,
	Img,
	staticFile,
} from 'remotion';
import { z } from 'zod';

const style: React.CSSProperties = {
	position: 'absolute',
	width: 500,
	height: 500,
	top: 'calc(50% - 350px)',
	left: 'calc(50% - 250px)',
};

const title: React.CSSProperties = {
	fontFamily: 'Montserrat',
	fontWeight: 'bold',
	fontSize: 64,
	textAlign: 'center',
	position: 'absolute',
	bottom: 660,
	width: '100%',
	padding: '0 50px',
};

export const myCompSchema2 = z.object({
	titleText: z.string(),
});

export const Logo: React.FC<z.infer<typeof myCompSchema2>> = ({
	titleText,
}) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();
	const opacity = interpolate(
		frame,
		[0, 30, durationInFrames - 30, durationInFrames],
		[0, 1, 1, 0]
	);

	return (
		<AbsoluteFill>
			<Img
				style={{ ...style, opacity }}
				src={staticFile('logo.jpg')}
				placeholder="logo"
			/>
			{/* <div style={{ ...title, opacity }}>{titleText}</div> */}
			<div style={{ ...title, opacity }} dangerouslySetInnerHTML={{ __html: titleText }} />
		</AbsoluteFill>
	);
};

export const myCompSchema = z.object({
	titleText: z.string(),
});

export const Outro: React.FC<z.infer<typeof myCompSchema>> = ({
	titleText: propOne,
}) => {
	return (
		<AbsoluteFill style={{ backgroundColor: 'white' }}>
			<Logo titleText={propOne} />
		</AbsoluteFill>
	);
};
