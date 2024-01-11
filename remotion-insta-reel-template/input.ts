import { staticFile } from 'remotion';

// ! Change inputs here
const videoLength = 50;
const outroLength = 5;
const number = 19
const word = 'Target'
const name = `${number}.${word}`
const delay = 0.5
// '#0a60af' '#5D3587' '#820300' '#3559E0' '#65B741'
const bgColor = '#0a60af'

export const Input = {
  id: word,
  width: 1080,
  height: 1920,
  defaultProps: {
    bgColor,

    // Audio settings
    audioOffsetInSeconds: 0,
    delayAtFirstSeconds: delay,
    durationInSeconds: delay + videoLength + outroLength,

    // Title settings
    // ! TODO !
    audioFileName: staticFile(`final/${name}.mp3`),
    coverImgFileName: staticFile(`final/${name}.jpg`),
    subtitlesFileName: staticFile(`final/${name}.srt`),
    thumbnailFileName: staticFile(`final/${name}-thumbnail.jpg`),
    titleText: `Daily Word #${number}`,
    word,

    titleColor: 'rgba(286, 286, 286, 0.93)',
    // Subtitles settings
    onlyDisplayCurrentSentence: true,
    subtitlesTextColor: 'rgba(255, 255, 255, 0.93)',
    subtitlesLinePerPage: 8,
    subtitlesZoomMeasurerSize: 10,
    subtitlesLineHeight: 98,

    // Wave settings
    waveColor: '#ffffff',
    waveFreqRangeStartIndex: 7,
    waveLinesToDisplay: 29,
    waveNumberOfSamples: '256', // This is string for Remotion controls and will be converted to a number
    mirrorWave: true,

    // Footer
    footerTitle: '', // 'Follow @BluLexiAI For more!',

    // Ending
    endingTitle: '@BluLexiAI<br>Your AI Test Prep Companion'
  }
}