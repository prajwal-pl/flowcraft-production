"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FlowNode, NodeData, TaskType } from "@/types/nodes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypeIcon } from "lucide-react";

export default function GenerateTextNode({ data }: NodeProps<FlowNode>) {
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
            <TypeIcon size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Generate Text</div>
            <div className="text-xs text-muted-foreground">
              Create AI-generated content
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="prompt" className="text-xs">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              className="w-full text-xs min-h-[80px] resize-none"
              placeholder="Enter your prompt here..."
              defaultValue={data.inputs.prompt || ""}
              onChange={(e) => {
                data.inputs.prompt = e.target.value;
              }}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="max-tokens" className="text-xs">
              Max Tokens
            </Label>
            <Input
              id="max-tokens"
              type="number"
              className="w-full h-8 text-xs"
              placeholder="Maximum tokens"
              defaultValue={data.inputs.maxTokens || 1000}
              onChange={(e) => {
                data.inputs.maxTokens = parseInt(e.target.value);
              }}
            />
          </div>
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
