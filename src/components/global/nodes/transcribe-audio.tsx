"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FlowNode, NodeData, TaskType } from "@/types/nodes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioWaveformIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TranscribeAudioNode({ data }: NodeProps<FlowNode>) {
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
            <AudioWaveformIcon size={18} />
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
            <div
              className={cn(
                "w-full rounded-md border px-3 py-1 text-sm bg-background",
                "focus-within:ring-1 focus-within:ring-ring"
              )}
            >
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
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
