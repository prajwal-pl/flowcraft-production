// Types for image generation and history
export interface HistoryPart {
  text?: string;
  image?: string;
}

export interface HistoryItem {
  role: "user" | "model";
  parts: HistoryPart[];
}

export interface ImageGenerationResponse {
  image: string | null;
  description: string | null;
}
