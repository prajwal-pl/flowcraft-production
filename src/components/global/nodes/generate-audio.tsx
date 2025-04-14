"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SparklesIcon, Music } from "lucide-react";

export default function GenerateAudioNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-blue-200 dark:bg-slate-900 dark:border-blue-800 min-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Music size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Generate Audio</div>
            <div className="text-xs text-muted-foreground">Text to speech</div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="audio-text" className="text-xs">
              Text to Speak
            </Label>
            <Textarea
              id="audio-text"
              className="w-full text-xs min-h-[80px] resize-none"
              placeholder="Enter text to convert to speech..."
              defaultValue={data.inputs.text || ""}
              onChange={(e) => {
                data.inputs.text = e.target.value;
              }}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="voice-type" className="text-xs">
              Voice
            </Label>
            <Select
              defaultValue={data.inputs.voice || "en-US"}
              onValueChange={(value) => {
                data.inputs.voice = value;
              }}
            >
              <SelectTrigger id="voice-type" className="w-full h-8 text-xs">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">Fritz</SelectItem>
                <SelectItem value="es-ES">Angelo</SelectItem>
                <SelectItem value="fr-FR">Jennifer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output rendering removed - now displayed in results tab */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  );
}
