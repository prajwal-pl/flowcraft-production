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
 * Generates text using Groq's API or simulates text generation when API key is missing
 */
export async function generateText(
  prompt: string,
  maxTokens: number = 500
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Generating text...");

    if (hasGroqApiKey && groq) {
      // Make API request to Groq
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        max_tokens: maxTokens,
      });

      const generatedText =
        completion.choices[0]?.message?.content ||
        "Unable to generate text. Please try a different prompt.";

      // Show success toast
      toast.success("Text generation complete", {
        id: toastId,
        description: "Text has been generated successfully",
      });

      return generatedText;
    } else {
      // Simulate text generation when API key is missing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate simulated response based on prompt
      let simulatedText = "";
      if (
        prompt.toLowerCase().includes("hello") ||
        prompt.toLowerCase().includes("hi")
      ) {
        simulatedText =
          "Hello! How can I assist you today? I'm a simulated AI response since no API key was provided for the actual AI service.";
      } else if (prompt.toLowerCase().includes("weather")) {
        simulatedText =
          "The weather today is sunny with a high of 75°F and a low of 60°F. There's a 10% chance of rain in the evening. This is a simulated response.";
      } else if (prompt.toLowerCase().includes("recipe")) {
        simulatedText =
          "Here's a simple pasta recipe:\n\n1. Boil water and add salt\n2. Cook pasta for 8-10 minutes\n3. In a pan, sauté garlic in olive oil\n4. Add tomatoes and basil\n5. Mix sauce with drained pasta\n\nThis is a simulated recipe response.";
      } else {
        simulatedText = `This is a simulated response to your prompt: "${prompt}". In a production environment with a valid API key, you would receive an actual AI-generated response here. The response would be based on your input and contain approximately ${maxTokens} tokens of relevant information.`;
      }

      // Show success toast with simulation notice
      toast.success("Text generation complete (Simulation)", {
        id: toastId,
        description: "Simulated text has been generated successfully",
      });

      return simulatedText;
    }
  } catch (error) {
    console.error("Error generating text:", error);

    // Show error toast
    toast.error("Failed to generate text", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback text when error occurs
    return "An error occurred while generating text. This is a fallback response to allow the workflow to continue.";
  }
}
