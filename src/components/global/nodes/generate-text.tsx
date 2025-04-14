"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function GenerateTextNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-purple-200 dark:bg-slate-900 dark:border-purple-800 min-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Generate Text</div>
            <div className="text-xs text-muted-foreground">
              AI text generation
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="text-prompt" className="text-xs">
              Prompt
            </Label>
            <Textarea
              id="text-prompt"
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
              defaultValue={data.inputs.maxTokens || 500}
              onChange={(e) => {
                data.inputs.maxTokens = parseInt(e.target.value);
              }}
            />
          </div>

          {/* Output rendering removed - now displayed in results tab */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !w-3 !h-3"
      />
    </div>
  );
}
