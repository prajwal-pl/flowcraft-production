"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FlowNode, NodeData, TaskType } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon } from "lucide-react";

export default function GenerateImageNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-green-200 dark:bg-slate-900 dark:border-green-800 min-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <ImageIcon size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Generate Image</div>
            <div className="text-xs text-muted-foreground">
              AI image generation
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="image-prompt" className="text-xs">
              Prompt
            </Label>
            <Textarea
              id="image-prompt"
              className="w-full text-xs min-h-[80px] resize-none"
              placeholder="Describe the image you want to generate..."
              defaultValue={data.inputs.prompt || ""}
              onChange={(e) => {
                data.inputs.prompt = e.target.value;
              }}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image-size" className="text-xs">
              Size
            </Label>
            <Select
              defaultValue={data.inputs.size || "512x512"}
              onValueChange={(value) => {
                data.inputs.size = value;
              }}
            >
              <SelectTrigger id="image-size" className="w-full h-8 text-xs">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="256x256">Small (256x256)</SelectItem>
                <SelectItem value="512x512">Medium (512x512)</SelectItem>
                <SelectItem value="1024x1024">Large (1024x1024)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output rendering removed - now displayed in results tab */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500 !w-3 !h-3"
      />
    </div>
  );
}
