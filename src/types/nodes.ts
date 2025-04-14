import { Node } from "@xyflow/react";

export type NodeData = {
  label: string;
  taskType: TaskType;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
};

export enum TaskType {
  SUMMARIZE_PDF = "summarisePdf",
  GENERATE_IMAGE = "generateImage",
  READ_IMAGE = "readImage",
  TRANSCRIBE_AUDIO = "transcribeAudio",
  GENERATE_AUDIO = "generateAudio",
  GENERATE_TEXT = "generateText",
  TRANSLATE_TEXT = "translateText", // Added for future implementation
}

export type NodeConfig = {
  type: string;
  label: string;
  taskType: TaskType;
  inputs: {
    name: string;
    type: "text" | "file" | "number" | "select";
    options?: string[];
    default?: any;
  }[];
  outputs: {
    name: string;
    type: string;
  }[];
};

// Type alias for our custom node
export type FlowNode = Node<NodeData>;
