"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MicIcon } from "lucide-react";

export default function TranscribeAudioNode({ data }: NodeProps<FlowNode>) {
  const hasFile = data.inputs && data.inputs.file;

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-orange-200 dark:bg-slate-900 dark:border-orange-800 min-w-[280px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
            <MicIcon size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Transcribe Audio</div>
            <div className="text-xs text-muted-foreground">
              Convert speech to text
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="audio-file" className="text-xs">
              Audio File
            </Label>
            <div className="flex items-center">
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                className="w-full h-8 text-xs"
                onChange={(e) => {
                  data.inputs.file = e.target.files?.[0] || null;
                }}
              />
            </div>
            {hasFile && (
              <div className="mt-1">
                <span className="text-xs text-green-600 dark:text-green-400">
                  File selected:{" "}
                  {typeof data.inputs.file === "string"
                    ? data.inputs.file
                    : data.inputs.file?.name || "Unknown"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="model" className="text-xs">
              Model
            </Label>
            <Select
              defaultValue={data.inputs.model || "whisper-large-v3-turbo"}
              onValueChange={(value) => {
                data.inputs.model = value;
              }}
            >
              <SelectTrigger id="model" className="w-full h-8 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper-large-v3-turbo">
                  Whisper Large V3 Turbo (Fast)
                </SelectItem>
                <SelectItem value="whisper-large-v3">
                  Whisper Large V3 (Accurate)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="language" className="text-xs">
              Language (Optional)
            </Label>
            <Select
              defaultValue={data.inputs.language || "en"}
              onValueChange={(value) => {
                data.inputs.language = value;
              }}
            >
              <SelectTrigger id="language" className="w-full h-8 text-xs">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output rendering removed - now displayed in results tab */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-orange-500 !w-3 !h-3"
      />
    </div>
  );
}
