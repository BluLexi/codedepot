import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import React, { useEffect, useRef, useState, Component } from 'react';
import {
	AbsoluteFill,
	Audio,
	continueRender,
	delayRender,
	Img,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import Icon from '@mdi/react';
import {
	mdiHeartOutline,
	mdiHeart,
	mdiChatOutline,
	mdiSendVariantOutline,
	mdiShareVariant,
	mdiBookmarkOutline,
} from '@mdi/js';

export const fps = 30;

import { PaginatedSubtitles } from './Subtitles';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const AudioGramSchema = z.object({
	durationInSeconds: z.number().positive(),
	audioOffsetInSeconds: z.number().min(0),
	subtitlesFileName: z.string().refine((s) => s.endsWith('.srt'), {
		message: 'Subtitles file must be a .srt file',
	}),
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
							backgroundColor: `var(--base-primary)`,
							height: `${500 * Math.sqrt(v)}%`,
						}}
					/>
				);
			})}
		</div>
	);
};

export const AudiogramComposition: React.FC<AudiogramCompositionSchemaType> = ({
	subtitlesFileName,
	audioFileName,
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

	return (
		<div ref={ref}>
			<AbsoluteFill>
				<Sequence from={-audioOffsetInFrames}>
					<Audio src={audioFileName} />

					<div
						className="container"
						style={{
							fontFamily: 'Montserrat',
						}}
					>
						<h1 className="blulexi-title">
							{/* Let’s conquer English language, one word at a time 😎🚀 */}
						</h1>

						<div className="bg-color">
							<div className="row">
								<Img className="cover" src={coverImgFileName} />

								<div className="title" style={{ color: titleColor }}>
									{titleText}
									<span style={{ color: 'var(--base-yellow)' }}>"{word}"</span>
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
							Follow
							<span style={{ color: 'var(--base-primary)' }}> @BluLexiAI </span>
							For more!
							<br />
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-around',
									maxWidth: '300px',
									margin: 'auto',
								}}
							>
								<Icon
									path={mdiHeart}
									size={3}
									color="red"
									style={{
										marginTop: '4px',
									}}
								/>

								<Icon
									path={mdiChatOutline}
									size={3}
									style={{
										marginTop: '4px',
									}}
								/>

								<Icon
									path={mdiSendVariantOutline}
									size={3}
									rotate={-25}
									style={{
										marginTop: '0px',
									}}
								/>
								{/* // color="red" */}
								{/* horizontal
								vertical */}
							</div>
						</h2>
					</div>
				</Sequence>
			</AbsoluteFill>
		</div>
	);
};
