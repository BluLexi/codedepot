import { staticFile } from 'remotion';

const videoLength = 71;
const outroLength = 5;

export const Input = {
  id: "Audiogram",
  width: 1080,
  height: 1920,
  defaultProps: {
    // Audio settings
    audioOffsetInSeconds: 0,

    // Title settings
    // ! TODO !
    audioFileName: staticFile('final/1.abandon.mp3'),
    coverImgFileName: staticFile('final/abandon.jpg'),
    subtitlesFileName: staticFile('final/1.abandon-subtitle.srt'),
    titleText: 'Daily Word #1',
    word: 'Abandon',


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
    durationInSeconds: videoLength + outroLength,

    // Footer
    footerTitle: 'Follow @BluLexiAI For more!',

    // Ending
    endingTitle: '@BluLexiAI, Your AI Test Prep Companion'
  }
}