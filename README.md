This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

### Speech-to-Text with Groq Whisper

The application now supports audio transcription using Groq's fast Whisper models:

- **whisper-large-v3-turbo**: Fast transcription with excellent performance (default)
- **whisper-large-v3**: High accuracy transcription for error-sensitive applications

#### Supported Audio Formats
- FLAC, MP3, MP4, MPEG, MPGA, M4A, OGG, WAV, WEBM

#### Supported Languages
- English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, Russian, and 90+ more

#### Configuration
Set your Groq API key in the environment:
```bash
NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
```

#### Usage
1. Add a "Transcribe Audio" node to your workflow
2. Upload an audio file or connect it from a previous node
3. Select your preferred model (turbo for speed, v3 for accuracy)
4. Optionally specify the language for better accuracy
5. Run the workflow to get the transcribed text

#### Audio Translation
The application also includes an `translateAudio` function that translates audio to English using Groq's Whisper models. This feature is available in the codebase for future integration.

### Text-to-Speech with Groq Orpheus

The application now supports text-to-speech using Groq's Orpheus models:

- **canopylabs/orpheus-v1-english**: Expressive English TTS with vocal direction controls
- **canopylabs/orpheus-arabic-saudi**: Authentic Saudi Arabic dialect synthesis

#### Supported Voices
- **Hannah** (English) - Clear and natural voice
- **Troy** (English) - Professional voice
- **Austin** (English) - Warm and friendly voice

#### Vocal Directions
Orpheus supports vocal directions to control the emotional tone of the speech:
- Use `[cheerful]`, `[sad]`, `[excited]`, etc. in your text to add emotional expression

#### Usage
1. Add a "Generate Audio" node to your workflow
2. Enter the text you want to convert to speech
3. Select your preferred model (English or Arabic)
4. Choose a voice
5. Run the workflow to generate the audio

**Example:**
```
Welcome to our service. [cheerful] We're excited to help you today!
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
