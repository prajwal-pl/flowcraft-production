"use client";

import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileTextIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SummarizePDFNode({ data }: NodeProps<FlowNode>) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Initialize file state from data on component mount
  useEffect(() => {
    if (data.inputs?.file) {
      if (typeof data.inputs.file === 'string') {
        // If it's a string (URL or path), extract filename
        const parts = data.inputs.file.split('/');
        setFileName(parts[parts.length - 1]);
      } else if (data.inputs.file instanceof File) {
        // If it's a File object
        setFileName(data.inputs.file.name);
      }
    }
  }, [data.inputs?.file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setFileError("Please select a PDF file.");
        return;
      }
      
      // Set file in node data
      data.inputs.file = selectedFile;
      setFileName(selectedFile.name);
    } else {
      data.inputs.file = null;
      setFileName(null);
    }
  };

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
                onChange={handleFileChange}
              />
            </div>
            {fileError && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">
                  {fileError}
                </AlertDescription>
              </Alert>
            )}
            {fileName && !fileError && (
              <div className="mt-1">
                <span className="text-xs text-green-600 dark:text-green-400">
                  File selected: {fileName}
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
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0) {
                  data.inputs.maxLength = value;
                }
              }}
              min="50"
              max="2000"
            />
          </div>

          {/* If we have a summary output, show a preview indicator */}
          {data.outputs?.summary && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded text-xs border border-amber-200 dark:border-amber-800">
              <p className="font-medium text-amber-800 dark:text-amber-300">Summary Generated</p>
              <p className="text-amber-700 dark:text-amber-400 truncate">
                {typeof data.outputs.summary === 'string' 
                  ? `${data.outputs.summary.substring(0, 30)}...` 
                  : 'Summary available in results view'}
              </p>
            </div>
          )}
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
