import Groq from "groq-sdk";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { generateImageWithAI } from "@/actions/image";

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
 * Generates an image using Gemini AI service
 */
export async function generateImage(
  prompt: string,
  size: string = "512x512"
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Generating image...");

    // Append size information to prompt for better results
    const enhancedPrompt = `${prompt} (Generate in ${size} resolution)`;

    // Call the server action to generate the image
    const result = await generateImageWithAI(enhancedPrompt);

    if (!result.image) {
      throw new Error("Failed to generate image: No image data received");
    }

    // Show success toast
    toast.success("Image generation complete", {
      id: toastId,
      description: "Image has been generated successfully",
    });

    return result.image;
  } catch (error) {
    console.error("Error generating image:", error);

    // Show error toast
    toast.error("Failed to generate image", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Fallback to basic placeholder if an error occurs
    return "https://placehold.co/512x512/999/FFF?text=Error+Image";
  }
}

/**
 * Reads text from an image (OCR)
 */
export async function readImage({
  file,
}: {
  file: File | string;
}): Promise<{ text: string; imageUrl: string }> {
  try {
    // Show pending toast
    const toastId = toast.loading("Processing image...");

    // Get real image URL from the uploaded file
    let imageUrl = "";

    if (typeof file === "string") {
      // If file is already a string URL, use it directly
      imageUrl = file;
    } else {
      // Convert File object to base64 string
      imageUrl = await fileToBase64(file);
    }

    let extractedText = "";

    if (hasGroqApiKey && groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 300,
      });

      extractedText =
        completion.choices[0]?.message?.content ||
        "OCR extraction failed. Please try with a different image.";
    } else {
      // Fallback message when Groq API key is not available
      extractedText =
        "OCR requires a Groq API key. Please configure your API key in the environment variables.";

      toast.warning("API key missing", {
        description: "Image reading requires a Groq API key to be configured",
      });
    }

    // Show success toast
    toast.success("Image reading complete", {
      id: toastId,
      description: "Text has been extracted from the image",
    });

    return { text: extractedText, imageUrl };
  } catch (error) {
    console.error("Error reading image:", error);

    // Show error toast
    toast.error("Failed to read image", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback text when error occurs
    return {
      text: "An error occurred while extracting text from the image. Please try again with a different image.",
      imageUrl: "",
    };
  }
}

/**
 * Converts a File object to a base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
