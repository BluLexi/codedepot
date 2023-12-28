import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import React, { useEffect, useRef, useState } from 'react';
import {
	AbsoluteFill,
	Audio,
	continueRender,
	delayRender,
	Img,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from 'remotion';

import { interpolate, spring } from 'remotion';

const Box = () => {
	const frame = useCurrentFrame();
	const durationInFrames = 20 * 60; // Example duration at 60fps

	// Interpolate values for each keyframe
	const translateY = spring({
		fps: 60,
		frame,
		config: {
			damping: 200,
		},
		from: -1387,
		to: 295, // Adjust based on translateY range
		durationInFrames,
	});

	const scaleX = interpolate(
		frame,
		[
			0,
			durationInFrames / 4,
			durationInFrames / 2,
			(3 * durationInFrames) / 4,
			durationInFrames,
		],
		[-123, 276, -456, 380, -123]
	);

	// Set transform origin to bottom
	const transformOrigin = 'bottom';

	return (
		<AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
			<div
				style={{
					transform: `translate(${scaleX}rem, ${translateY}rem)`,
					transformOrigin,
					backgroundColor: 'var(--base-circle)',
					height: '25rem',
					width: '25rem',
					borderRadius: '50%',
					position: 'relative',
					margin: '0 auto',
				}}
			/>
		</AbsoluteFill>
	);
};

export const fps = 30;

import { PaginatedSubtitles } from './Subtitles';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { Like } from './icons/Like';
import { Comment } from './icons/Comment';
import { Share } from './icons/Share';
import { Outro } from './Outro';
import { YouTubeLike } from './icons/YouTubeLike';
import { YouTubeComment } from './icons/YouTubeComment';
import { YouTubeShare } from './icons/YouTubeShare';
import BlurBubble from './BlurBubble';

export const AudioGramSchema = z.object({
	durationInSeconds: z.number().positive(),
	audioOffsetInSeconds: z.number().min(0),
	delayAtFirstSeconds: z.number().min(0),
	subtitlesFileName: z.string().refine((s) => s.endsWith('.srt'), {
		message: 'Subtitles file must be a .srt file',
	}),
	thumbnailFileName: z
		.string()
		.refine(
			(s) =>
				s.endsWith('.jpg') ||
				s.endsWith('.jpeg') ||
				s.endsWith('.png') ||
				s.endsWith('.bmp'),
			{
				message: 'Image file must be a .jpg / .jpeg / .png / .bmp file',
			}
		),
	audioFileName: z.string().refine((s) => s.endsWith('.mp3'), {
		message: 'Audio file must be a .mp3 file',
	}),
	coverImgFileName: z
		.string()
		.refine(
			(s) =>
				s.endsWith('.jpg') ||
				s.endsWith('.jpeg') ||
				s.endsWith('.png') ||
				s.endsWith('.bmp'),
			{
				message: 'Image file must be a .jpg / .jpeg / .png / .bmp file',
			}
		),
	titleText: z.string(),
	word: z.string(),
	titleColor: zColor(),
	waveColor: zColor(),
	subtitlesTextColor: zColor(),
	subtitlesLinePerPage: z.number().int().min(0),
	subtitlesLineHeight: z.number().int().min(0),
	subtitlesZoomMeasurerSize: z.number().int().min(0),
	onlyDisplayCurrentSentence: z.boolean(),
	mirrorWave: z.boolean(),
	waveLinesToDisplay: z.number().int().min(0),
	waveFreqRangeStartIndex: z.number().int().min(0),
	waveNumberOfSamples: z.enum(['32', '64', '128', '256', '512']),
	footerTitle: z.string(),
	endingTitle: z.string(),
});

type AudiogramCompositionSchemaType = z.infer<typeof AudioGramSchema>;

const AudioViz: React.FC<{
	waveColor: string;
	numberOfSamples: number;
	freqRangeStartIndex: number;
	waveLinesToDisplay: number;
	mirrorWave: boolean;
	audioSrc: string;
}> = ({
	waveColor,
	numberOfSamples,
	freqRangeStartIndex,
	waveLinesToDisplay,
	mirrorWave,
	audioSrc,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const audioData = useAudioData(audioSrc);

	if (!audioData) {
		return null;
	}

	const frequencyData = visualizeAudio({
		fps,
		frame,
		audioData,
		numberOfSamples, // Use more samples to get a nicer visualisation
	});

	// Pick the low values because they look nicer than high values
	// feel free to play around :)
	const frequencyDataSubset = frequencyData.slice(
		freqRangeStartIndex,
		freqRangeStartIndex +
			(mirrorWave ? Math.round(waveLinesToDisplay / 2) : waveLinesToDisplay)
	);

	const frequencesToDisplay = mirrorWave
		? [...frequencyDataSubset.slice(1).reverse(), ...frequencyDataSubset]
		: frequencyDataSubset;

	return (
		<div className="audio-viz">
			{frequencesToDisplay.map((v, i) => {
				return (
					<div
						key={i}
						className="bar"
						style={{
							minWidth: '1px',
							backgroundColor: waveColor,
							height: `${500 * Math.sqrt(v)}%`,
						}}
					/>
				);
			})}
		</div>
	);
};

// const HeartbeatIcon: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	const frame = useCurrentFrame();
// 	const { fps } = useVideoConfig();

// 	const scale = spring({
// 		fps,
// 		frame,
// 		config: {
// 			damping: 5, // Adjust the damping for the spring animation
// 			mass: 0.5, // Adjust the mass for the spring animation
// 			stiffness: 0.5, // Adjust the stiffness for the spring animation
// 		},
// 	});

// 	return <div style={{ transform: `scale(${scale})` }}>{children}</div>;
// };

interface HeartbeatIconProps {
	children: React.ReactNode;
	beatDurationSeconds: number;
	waitTimeSeconds: number;
}

const HeartbeatIcon: React.FC<HeartbeatIconProps> = ({
	children,
	beatDurationSeconds,
	waitTimeSeconds,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Calculate the total duration of one cycle (beat + wait)
	const totalCycleDuration = fps * (beatDurationSeconds + waitTimeSeconds);

	// Calculate the current time within the cycle
	const timeWithinCycle = frame % totalCycleDuration;

	// Determine if the icon should beat or wait based on the current time within the cycle
	const isBeating = timeWithinCycle <= fps * beatDurationSeconds;

	// Calculate progress for the beating effect
	const beatProgress = isBeating
		? timeWithinCycle / (fps * beatDurationSeconds)
		: 0;

	// Use Math.sin to create an oscillating effect only during the beating period
	const scale = isBeating ? 1 + 0.4 * Math.sin(beatProgress * 2 * Math.PI) : 1;

	return (
		<div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
			{children}
		</div>
	);
};

interface JiggleMotionProps {
	children: React.ReactNode;
	waitTime: number; // The wait time in seconds before the jiggle starts
}

const JiggleMotion: React.FC<JiggleMotionProps> = ({
	children,
	waitTime, // Destructure waitTime from props
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Duration of the jiggle in frames
	const jiggleDuration = fps * 0.5; // Half a second jiggle

	const time = frame / fps;

	// Calculate complete waiting cycles elapsed
	const completeCycles = Math.floor(time / waitTime);

	// The time since the last complete cycle
	const timeSinceLastCycle = time - completeCycles * waitTime;

	// Determine if jiggle should occur
	const shouldJiggle = timeSinceLastCycle < jiggleDuration / fps;

	// Calculate progress of the jiggle
	const progress = shouldJiggle
		? Math.sin((timeSinceLastCycle / (jiggleDuration / fps)) * Math.PI * 4)
		: 0;

	// Translation is 0 when shouldJiggle is false
	const translation = shouldJiggle
		? interpolate(progress, [-1, 1], [-10, 10], {
				easing: Easing.easeInOutSine,
		  })
		: 0;

	// Apply the translation
	return (
		<div style={{ transform: `translateX(${translation}px)` }}>{children}</div>
	);
};

export const AudiogramComposition: React.FC<AudiogramCompositionSchemaType> = ({
	bgColor,
	subtitlesFileName,
	audioFileName,
	thumbnailFileName,
	coverImgFileName,
	titleText,
	word,
	titleColor,
	subtitlesTextColor,
	subtitlesLinePerPage,
	waveColor,
	waveNumberOfSamples,
	waveFreqRangeStartIndex,
	waveLinesToDisplay,
	subtitlesZoomMeasurerSize,
	subtitlesLineHeight,
	onlyDisplayCurrentSentence,
	mirrorWave,
	audioOffsetInSeconds,
	delayAtFirstSeconds,
	durationInSeconds,
	endingTitle,
	footerTitle,
}) => {
	const { durationInFrames } = useVideoConfig();

	const [handle] = useState(() => delayRender());
	const [subtitles, setSubtitles] = useState<string | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch(subtitlesFileName)
			.then((res) => res.text())
			.then((text) => {
				setSubtitles(text);
				continueRender(handle);
			})
			.catch((err) => {
				console.log('Error fetching subtitles', err);
			});
	}, [handle, subtitlesFileName]);

	if (!subtitles) {
		return null;
	}

	const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
	const delayAtFirstInFrames = Math.round(delayAtFirstSeconds * fps);
	const outroInFrame = Math.round((durationInSeconds - 4) * fps);

	return (
		<div ref={ref}>
			<AbsoluteFill>
				<Sequence durationInFrames={delayAtFirstInFrames}>
					<Img src={thumbnailFileName} placeholder={undefined} />
				</Sequence>
				<Sequence from={-audioOffsetInFrames + delayAtFirstInFrames}>
					<Audio src={audioFileName} placeholder={undefined} />

					<div
						className="container"
						style={{
							fontFamily: 'Montserrat',
							backgroundColor: bgColor,
						}}
					>
						{/* <Box /> */}
						{/* <BlurBubble /> */}

						<div className="glass-effect">
							<div className="row from-top">
								<Img
									className="cover"
									src={coverImgFileName}
									placeholder={undefined}
								/>

								<div
									className="title"
									style={{ color: titleColor, marginTop: 'auto' }}
								>
									{titleText}
									<div
										style={{
											color: 'var(--base-orange)',
											textTransform: 'uppercase',
										}}
									>
										"{word}"
									</div>
								</div>
							</div>

							<div>
								<AudioViz
									audioSrc={audioFileName}
									mirrorWave={mirrorWave}
									waveColor={waveColor}
									numberOfSamples={Number(waveNumberOfSamples)}
									freqRangeStartIndex={waveFreqRangeStartIndex}
									waveLinesToDisplay={waveLinesToDisplay}
								/>
							</div>

							<div
								style={{ lineHeight: `${subtitlesLineHeight}px` }}
								className="captions"
							>
								<PaginatedSubtitles
									subtitles={subtitles}
									startFrame={audioOffsetInFrames}
									endFrame={audioOffsetInFrames + durationInFrames}
									linesPerPage={subtitlesLinePerPage}
									subtitlesTextColor={subtitlesTextColor}
									subtitlesZoomMeasurerSize={subtitlesZoomMeasurerSize}
									subtitlesLineHeight={subtitlesLineHeight}
									onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
								/>
							</div>
						</div>

						<h2 className="blulexi-footer">
							{footerTitle}
							<br />
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-around',
									maxWidth: '300px',
									width: '300px',
									margin: 'auto',
									marginTop: '14px',
								}}
							>
								<HeartbeatIcon beatDurationSeconds={2} waitTimeSeconds={4}>
									<YouTubeLike />
								</HeartbeatIcon>
								{/* <Like /> */}

								<JiggleMotion waitTime={7}>
									<YouTubeComment />
								</JiggleMotion>
								{/* <Comment /> */}
								{/* <Share /> */}
								<HeartbeatIcon beatDurationSeconds={2.5} waitTimeSeconds={6}>
									<YouTubeShare />
								</HeartbeatIcon>
							</div>
						</h2>
					</div>
				</Sequence>
				<Sequence from={outroInFrame}>
					<Outro titleText={endingTitle} />
				</Sequence>
			</AbsoluteFill>
		</div>
	);
};
