"use server";

import { GoogleGenAI } from "@google/genai";
import { HistoryItem, ImageGenerationResponse } from "@/lib/types";

// Initialize the Google Gen AI client with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Define the model ID for Gemini 2.0 Flash experimental
const MODEL_ID = "gemini-2.0-flash-exp-image-generation";

// Define interface for the formatted history item
interface FormattedHistoryItem {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    inlineData?: { data: string; mimeType: string };
  }>;
}

export async function generateImageWithAI(
  prompt: string,
  inputImage?: string,
  history?: HistoryItem[]
): Promise<ImageGenerationResponse> {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    // Convert history to the format expected by Gemini API
    const formattedHistory: any[] =
      history && history.length > 0
        ? history
            .map((item: HistoryItem) => {
              return {
                role: item.role,
                parts: item.parts
                  .map((part) => {
                    if (part.text) {
                      return { text: part.text };
                    }
                    if (part.image && item.role === "user") {
                      const imgParts = part.image.split(",");
                      if (imgParts.length > 1) {
                        return {
                          inlineData: {
                            data: imgParts[1],
                            mimeType: part.image.includes("image/png")
                              ? "image/png"
                              : "image/jpeg",
                          },
                        };
                      }
                    }
                    return null;
                  })
                  .filter(Boolean), // Remove null parts
              };
            })
            .filter((item) => item.parts.length > 0) // Remove items with no parts
        : [];

    // Prepare the current message parts
    const messageParts: any[] = [];

    // Add the text prompt
    messageParts.push({ text: prompt });

    // Add the image if provided
    if (inputImage) {
      // For image editing
      console.log("Processing image edit request");

      // Check if the image is a valid data URL
      if (!inputImage.startsWith("data:")) {
        throw new Error("Invalid image data URL format");
      }

      const imageParts = inputImage.split(",");
      if (imageParts.length < 2) {
        throw new Error("Invalid image data URL format");
      }

      const base64Image = imageParts[1];
      const mimeType = inputImage.includes("image/png")
        ? "image/png"
        : "image/jpeg";

      // Add the image to message parts
      messageParts.push({
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      });
    }

    // Create the content for the API call
    const contents =
      formattedHistory.length > 0
        ? [...formattedHistory, { role: "user", parts: messageParts }]
        : { role: "user", parts: messageParts };

    // Generate the content
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: contents,
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    let textResponse = null;
    let imageData = null;
    let mimeType = "image/png";

    // Process the response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response?.candidates![0]!.content?.parts;

      for (const part of parts!) {
        if ("inlineData" in part && part.inlineData) {
          // Get the image data
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
        } else if ("text" in part && part.text) {
          // Store the text
          textResponse = part.text;
        }
      }
    }

    // Return the image and description
    return {
      image: imageData ? `data:${mimeType};base64,${imageData}` : null,
      description: textResponse,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
