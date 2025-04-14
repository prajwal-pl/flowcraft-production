import SummarizePDFNode from "@/components/global/nodes/summarize-PDF";
import GenerateImageNode from "@/components/global/nodes/generate-image";
import ReadImageNode from "@/components/global/nodes/read-image";
import TranscribeAudioNode from "@/components/global/nodes/transcribe-audio";
import GenerateAudioNode from "@/components/global/nodes/generate-audio";
import GenerateTextNode from "@/components/global/nodes/generate-text";
import { NodeConfig, TaskType } from "./nodes";
import { NodeTypes } from "@xyflow/react";

// Define a properly typed nodeTypes object compatible with ReactFlow
export const nodeTypes: NodeTypes = {
  summarisePdf: SummarizePDFNode, // Fixed to match the enum value "summarisePdf"
  generateImage: GenerateImageNode,
  readImage: ReadImageNode,
  transcribeAudio: TranscribeAudioNode,
  generateAudio: GenerateAudioNode,
  generateText: GenerateTextNode,
};

export const nodeConfigs: NodeConfig[] = [
  {
    type: "summarisePdf", // Fixed to match the nodeTypes key
    label: "Summarize PDF",
    taskType: TaskType.SUMMARIZE_PDF,
    inputs: [
      {
        name: "file",
        type: "file",
      },
      { name: "maxLength", type: "number", default: 500 },
    ],
    outputs: [
      {
        name: "summary",
        type: "text",
      },
    ],
  },
  {
    type: "generateImage",
    label: "Generate Image",
    taskType: TaskType.GENERATE_IMAGE,
    inputs: [
      {
        name: "prompt",
        type: "text",
      },
      {
        name: "size",
        type: "select",
        options: ["256x256", "512x512", "1024x1024"],
      },
    ],
    outputs: [
      {
        name: "image",
        type: "file",
      },
    ],
  },
  {
    type: "readImage",
    label: "Read Image",
    taskType: TaskType.READ_IMAGE,
    inputs: [
      {
        name: "file",
        type: "file",
      },
    ],
    outputs: [
      {
        name: "text",
        type: "text",
      },
    ],
  },
  {
    type: "transcribeAudio",
    label: "Transcribe Audio",
    taskType: TaskType.TRANSCRIBE_AUDIO,
    inputs: [
      {
        name: "file",
        type: "file",
      },
    ],
    outputs: [
      {
        name: "text",
        type: "text",
      },
    ],
  },
  {
    type: "generateAudio",
    label: "Generate Audio",
    taskType: TaskType.GENERATE_AUDIO,
    inputs: [
      {
        name: "text",
        type: "text",
      },
      {
        name: "voice",
        type: "select",
        options: ["en-US", "es-ES", "fr-FR"],
      },
    ],
    outputs: [
      {
        name: "audio",
        type: "file",
      },
    ],
  },
  {
    type: "generateText",
    label: "Generate Text",
    taskType: TaskType.GENERATE_TEXT,
    inputs: [
      {
        name: "prompt",
        type: "text",
      },
      {
        name: "maxTokens",
        type: "number",
      },
    ],
    outputs: [
      {
        name: "text",
        type: "text",
      },
    ],
  },
];
