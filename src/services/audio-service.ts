import Groq from "groq-sdk";
import { toast } from "sonner";

// Initialize Groq client with optional API key
const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const hasGroqApiKey = !!groqApiKey;

let groq: Groq | null = null;
if (hasGroqApiKey) {
  groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true,
  });
}

/**
 * Generates audio from text using Groq's Orpheus text-to-speech models
 * Supports English and Arabic voices with vocal direction controls
 */
export async function generateAudio(
  text: string,
  voice: string = "hannah",
  options?: {
    model?: "canopylabs/orpheus-v1-english" | "canopylabs/orpheus-arabic-saudi";
    responseFormat?: "wav";
  }
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Generating audio...");

    let audioUrl = "";

    if (hasGroqApiKey && groq) {
      try {
        // Determine model based on voice if not specified
        const model =
          options?.model || "canopylabs/orpheus-v1-english";

        // Use Groq's Orpheus TTS API
        const response = await groq.audio.speech.create({
          model: model,
          voice: voice,
          input: text,
          response_format: options?.responseFormat || "wav",
        });

        // Convert the response to a base64 encoded data URL
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        audioUrl = `data:audio/wav;base64,${base64}`;

        // Show success toast
        toast.success("Audio generation complete", {
          id: toastId,
          description: `Generated audio with ${voice} voice is now available.`,
        });
      } catch (apiError) {
        console.error("Groq TTS API error:", apiError);

        // Show error and fall back to simulation
        toast.error("Audio generation failed", {
          id: toastId,
          description:
            apiError instanceof Error
              ? apiError.message
              : "Failed to generate audio. Using simulation mode.",
        });

        // Simulate processing time for fallback
        await new Promise((resolve) => setTimeout(resolve, 2000));
        audioUrl = `data:audio/mp3;base64,PLACEHOLDER_AUDIO_DATA`;
      }
    } else {
      // Simulate processing time when no API key is available
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a placeholder when no API keys are available
      audioUrl = `data:audio/mp3;base64,PLACEHOLDER_AUDIO_DATA`;

      // Show simulation toast
      toast.success("Audio generation complete (Simulation)", {
        id: toastId,
        description: `Generated audio with ${voice} voice is now available.`,
      });
    }

    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);

    // Show error toast
    toast.error("Failed to generate audio", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback audio URL when error occurs
    return `data:audio/mp3;base64,FALLBACK_AUDIO_DATA`;
  }
}

/**
 * Transcribes audio to text using Groq's Whisper models
 */
export async function transcribeAudio(
  file: File | string,
  options?: {
    model?: "whisper-large-v3" | "whisper-large-v3-turbo";
    language?: string;
    prompt?: string;
    temperature?: number;
    responseFormat?: "json" | "text" | "verbose_json";
    timestampGranularities?: Array<"word" | "segment">;
  }
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Transcribing audio...");

    // Get filename for better simulation/fallback
    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "audio.mp3"
        : file.name || "audio.mp3";

    let transcriptionText = "";

    if (hasGroqApiKey && groq) {
      try {
        // Validate that we have either a file or URL
        const hasFile = file instanceof File;
        const hasUrl = typeof file === "string" && file.length > 0;

        if (!hasFile && !hasUrl) {
          throw new Error(
            "Invalid input: file must be a File object or a non-empty URL string"
          );
        }

        // Use Groq's Whisper API for actual transcription
        const transcription = await groq.audio.transcriptions.create({
          file: hasFile ? (file as File) : undefined,
          url: hasUrl ? (file as string) : undefined,
          model:
            (options?.model as "whisper-large-v3" | "whisper-large-v3-turbo") ||
            "whisper-large-v3-turbo",
          language: options?.language,
          prompt: options?.prompt,
          temperature: options?.temperature ?? 0.0,
          response_format: options?.responseFormat || "json",
          timestamp_granularities: options?.timestampGranularities,
        });

        transcriptionText = transcription.text;

        // Show success toast
        toast.success("Audio transcription complete", {
          id: toastId,
          description: "Transcribed text is now available in the workflow.",
        });
      } catch (apiError) {
        console.error("Groq API error during transcription:", apiError);

        // Show warning and fall back to simulation
        toast.warning("API transcription failed, using simulation", {
          id: toastId,
          description: "Falling back to simulated transcription.",
        });

        // Generate fallback transcription
        transcriptionText = generateFallbackTranscription(fileName);
      }
    } else {
      // Simulate processing time when no API key is available
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Generate simulated transcription
      transcriptionText = generateFallbackTranscription(fileName);

      // Show simulation toast
      toast.success("Audio transcription complete (Simulation)", {
        id: toastId,
        description: "Transcribed text is now available in the workflow.",
      });
    }

    return transcriptionText;
  } catch (error) {
    console.error("Error transcribing audio:", error);

    // Show error toast
    toast.error("Failed to transcribe audio", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback transcription when error occurs
    return "An error occurred while transcribing the audio. This is a fallback transcription to allow the workflow to continue.";
  }
}

/**
 * Translates audio to English text using Groq's Whisper models
 */
export async function translateAudio(
  file: File | string,
  options?: {
    model?: "whisper-large-v3";
    prompt?: string;
    temperature?: number;
    responseFormat?: "json" | "text" | "verbose_json";
  }
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Translating audio...");

    // Get filename for better simulation/fallback
    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "audio.mp3"
        : file.name || "audio.mp3";

    let translationText = "";

    if (hasGroqApiKey && groq) {
      try {
        // Validate that we have either a file or URL
        const hasFile = file instanceof File;
        const hasUrl = typeof file === "string" && file.length > 0;

        if (!hasFile && !hasUrl) {
          throw new Error(
            "Invalid input: file must be a File object or a non-empty URL string"
          );
        }

        // Use Groq's Whisper API for actual translation
        const translation = await groq.audio.translations.create({
          file: hasFile ? (file as File) : undefined,
          url: hasUrl ? (file as string) : undefined,
          model: (options?.model as "whisper-large-v3") || "whisper-large-v3",
          prompt: options?.prompt,
          temperature: options?.temperature ?? 0.0,
          response_format: options?.responseFormat || "json",
        });

        translationText = translation.text;

        // Show success toast
        toast.success("Audio translation complete", {
          id: toastId,
          description: "Translated text is now available in the workflow.",
        });
      } catch (apiError) {
        console.error("Groq API error during translation:", apiError);

        // Show warning and fall back to simulation
        toast.warning("API translation failed, using simulation", {
          id: toastId,
          description: "Falling back to simulated translation.",
        });

        // Generate fallback translation
        translationText = `Translated to English: ${generateFallbackTranscription(fileName)}`;
      }
    } else {
      // Simulate processing time when no API key is available
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Generate simulated translation
      translationText = `Translated to English: ${generateFallbackTranscription(fileName)}`;

      // Show simulation toast
      toast.success("Audio translation complete (Simulation)", {
        id: toastId,
        description: "Translated text is now available in the workflow.",
      });
    }

    return translationText;
  } catch (error) {
    console.error("Error translating audio:", error);

    // Show error toast
    toast.error("Failed to translate audio", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback translation when error occurs
    return "An error occurred while translating the audio. This is a fallback translation to allow the workflow to continue.";
  }
}

/**
 * Helper function to generate fallback transcription for simulation mode
 */
function generateFallbackTranscription(fileName: string): string {
  if (fileName.toLowerCase().includes("interview")) {
    return "Interviewer: Thank you for joining us today. Can you tell us about your research?\n\nGuest: Certainly. Our team has been studying quantum computing applications in healthcare for the past three years. We've made significant progress in optimizing algorithms for protein folding simulations. The results suggest we could accelerate drug discovery by up to 40% compared to traditional computing methods.";
  } else if (
    fileName.toLowerCase().includes("lecture") ||
    fileName.toLowerCase().includes("lesson")
  ) {
    return "Today we'll be covering the fundamental principles of machine learning. As we discussed last week, supervised learning relies on labeled data sets. The algorithm learns to recognize patterns and makes predictions based on the training examples. Remember that the quality of your training data directly impacts the performance of your model.";
  } else if (fileName.toLowerCase().includes("podcast")) {
    return "Welcome to Tech Horizons podcast. In today's episode, we're exploring the ethical implications of artificial intelligence in surveillance systems. Our guest expert will share insights on balancing security needs with privacy concerns. Stay tuned for this important conversation about technology's role in modern society.";
  } else {
    return `This is a simulated transcription of the audio file "${fileName}". The audio appears to contain a discussion about technology and its impacts on society. Several speakers exchange views on innovation, privacy concerns, and regulatory frameworks. This is a simulation since no actual audio content is being processed.`;
  }
}
