"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileTextIcon } from "lucide-react";

export default function SummarizePDFNode({ data }: NodeProps<FlowNode>) {
  const hasFile = data.inputs && data.inputs.file;

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-amber-200 dark:bg-slate-900 dark:border-amber-800 min-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <FileTextIcon size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Summarize PDF</div>
            <div className="text-xs text-muted-foreground">
              Extract key information
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="pdf-file" className="text-xs">
              PDF File
            </Label>
            <div className="flex items-center">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
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
            <Label htmlFor="max-length" className="text-xs">
              Max Summary Length
            </Label>
            <Input
              id="max-length"
              type="number"
              className="w-full h-8 text-xs"
              defaultValue={data.inputs.maxLength || 500}
              onChange={(e) => {
                data.inputs.maxLength = parseInt(e.target.value);
              }}
            />
          </div>

          {/* Output rendering removed - now displayed in results tab */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-500 !w-3 !h-3"
      />
    </div>
  );
}
