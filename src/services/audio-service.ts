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
 * Simulates text-to-speech functionality
 * In a real implementation, we would use an actual TTS service
 */
export async function generateAudio(
  text: string,
  voice: string = "en-US"
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Generating audio...");

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, this would be the URL to the generated audio file
    // For now, we'll create a placeholder that could later be replaced with actual audio
    const audioUrl = `data:audio/mp3;base64,PLACEHOLDER_AUDIO_DATA`;

    // Show success toast
    toast.success("Audio generation complete (Simulation)", {
      id: toastId,
      description: `Generated audio with ${voice} voice is now available.`,
    });

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
 * Simulates audio transcription
 * In a real implementation, we would use an actual speech-to-text service
 */
export async function transcribeAudio(file: File | string): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Transcribing audio...");

    // Get filename for better simulation
    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "audio.mp3"
        : file.name || "audio.mp3";

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    let transcriptionText = "";

    if (hasGroqApiKey && groq) {
      // Generate a simulated transcription using Groq
      const transcription = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate a sample transcription for an audio file named "${fileName}" that might be about technology or science. Make it about 3-4 sentences.`,
          },
        ],
        model: "llama3-8b-8192",
        max_tokens: 200,
      });

      transcriptionText =
        transcription.choices[0]?.message?.content ||
        "This is a simulated transcription of the audio file. In a real implementation, this would be the actual text content from the audio.";
    } else {
      // Generate simulated transcription based on filename
      if (fileName.toLowerCase().includes("interview")) {
        transcriptionText =
          "Interviewer: Thank you for joining us today. Can you tell us about your research?\n\nGuest: Certainly. Our team has been studying quantum computing applications in healthcare for the past three years. We've made significant progress in optimizing algorithms for protein folding simulations. The results suggest we could accelerate drug discovery by up to 40% compared to traditional computing methods.";
      } else if (
        fileName.toLowerCase().includes("lecture") ||
        fileName.toLowerCase().includes("lesson")
      ) {
        transcriptionText =
          "Today we'll be covering the fundamental principles of machine learning. As we discussed last week, supervised learning relies on labeled data sets. The algorithm learns to recognize patterns and makes predictions based on the training examples. Remember that the quality of your training data directly impacts the performance of your model.";
      } else if (fileName.toLowerCase().includes("podcast")) {
        transcriptionText =
          "Welcome to Tech Horizons podcast. In today's episode, we're exploring the ethical implications of artificial intelligence in surveillance systems. Our guest expert will share insights on balancing security needs with privacy concerns. Stay tuned for this important conversation about technology's role in modern society.";
      } else {
        transcriptionText = `This is a simulated transcription of the audio file "${fileName}". The audio appears to contain a discussion about technology and its impacts on society. Several speakers exchange views on innovation, privacy concerns, and regulatory frameworks. This is a simulation since no actual audio content is being processed.`;
      }
    }

    // Show success toast
    toast.success(
      hasGroqApiKey
        ? "Audio transcription complete"
        : "Audio transcription complete (Simulation)",
      {
        id: toastId,
        description: "Transcribed text is now available in the workflow.",
      }
    );

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
