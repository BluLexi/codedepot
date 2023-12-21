import { staticFile } from 'remotion';

const videoLength = 79;
const outroLength = 5;

export const Input = {
  id: "Audiogram",
  width: 1080,
  height: 1920,
  defaultProps: {
    // Audio settings
    audioOffsetInSeconds: 0,

    // Title settings
    audioFileName: staticFile('audio1.mp3'),
    coverImgFileName: staticFile('abondon.jpg'),
    titleText: 'Daily Word #1',
    word: 'Disclose',
    titleColor: 'rgba(286, 286, 286, 0.93)',

    // Subtitles settings
    subtitlesFileName: staticFile('subtitles.srt'),
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
    durationInSeconds: videoLength + outroLength,

    // Footer
    footerTitle: 'Follow @BluLexiAI For more!',

    // Ending
    endingTitle: '@BluLexiAI, Your AI Test Prep Companion'
  }
}