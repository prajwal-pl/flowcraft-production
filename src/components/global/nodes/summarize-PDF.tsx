"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FlowNode, NodeData, TaskType } from "@/types/nodes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SummarizePDFNode({ data }: NodeProps<FlowNode>) {
  const [fileName, setFileName] = React.useState<string>("");

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-amber-200 dark:bg-slate-900 dark:border-amber-800 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <FileIcon size={18} />
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
            <div
              className={cn(
                "w-full rounded-md border px-3 py-1 text-sm bg-background",
                "focus-within:ring-1 focus-within:ring-ring"
              )}
            >
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                className="w-full text-xs border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  // Store file in node data
                  const file = e.target.files?.[0];
                  if (file) {
                    data.inputs.file = file;
                    setFileName(file.name);
                  }
                }}
              />
            </div>
            {fileName && (
              <p className="text-xs text-muted-foreground truncate">
                Selected: {fileName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="max-length" className="text-xs">
              Max Length
            </Label>
            <Input
              id="max-length"
              type="number"
              className="w-full h-8 text-xs"
              placeholder="Maximum summary length"
              defaultValue={data.inputs.maxLength || 500}
              onChange={(e) => {
                data.inputs.maxLength = parseInt(e.target.value);
              }}
            />
          </div>
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
