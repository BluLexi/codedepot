# The Template for BluLexi Instagram Reels

Explore transforming a "word" into a captivating video using ChatGPT and Remotion. Following is a walk-through for creating  an engaging audio-visual masterpiece.

1. Start by choosing a specific "word" you want to work on.
2. Utilize ChatGPT to articulate an explanation for the chosen "word."
3. Generate an audio file for the "word" in the form of an .mp3 file. The preferred choice is OpenAI's TTS model. But anything works.
4. Open VSCode and create a new .txt file. Input each word of the explanation on separate lines [replace all ' ' with 'ctrl + Enter' or 'cmd + return'].
5. Feed both the .txt file and the previously generated .mp3 file into the given python script to produce a .str file for the audio.
6. Take the resulting .mp3 and .str files and provide them to the template for video generation. Utilize React and save the final output as a .mp4 file.
7. Conduct testing and make necessary adjustments to color settings until satisfied. Once completed, consider the task done!


## How to render the video?

Run this:

```console
pnpm build
```

Or check out the [Remotion docs](/docs/render/). There are lots of ways to render.

## Commands

**Install Dependencies**

```console
pnpm i
```

**Start Preview**

```console
pnpm start
```

**Render video**

```console
pnpm build
```

**Upgrade Remotion**

```console
pnpm run upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## License

Note that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
