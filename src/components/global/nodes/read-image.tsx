"use client";

import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, TaskType, FlowNode } from "@/types/nodes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScanEyeIcon } from "lucide-react";

export default function ReadImageNode({ data }: NodeProps<FlowNode>) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const hasFile = data.inputs && data.inputs.file;
  const hasOutput =
    data.outputs && (data.outputs.text || data.outputs.imageUrl);

  // Handle file selection and convert to base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    data.inputs.file = selectedFile;

    // Create a preview URL for the selected image
    if (selectedFile) {
      // Convert to base64 for preview
      const base64 = await fileToBase64(selectedFile);
      setPreviewUrl(base64);
    } else {
      setPreviewUrl("");
    }
  };

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Clean up any object URLs when component unmounts or when the preview changes
  useEffect(() => {
    return () => {
      // Clean up any resources if needed
    };
  }, [previewUrl]);

  // Get image URL from either preview or the processed output
  const imageUrl =
    data.outputs?.imageUrl ||
    previewUrl ||
    (typeof data.inputs.file === "string" ? data.inputs.file : "");

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-teal-200 dark:bg-slate-900 dark:border-teal-800 min-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-teal-500 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
            <ScanEyeIcon size={18} />
          </div>
          <div className="ml-2">
            <div className="text-base font-bold">Read Image</div>
            <div className="text-xs text-muted-foreground">
              Extract text from images
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="image-file" className="text-xs">
              Image File
            </Label>
            <div className="flex items-center">
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                className="w-full h-8 text-xs"
                onChange={handleFileChange}
              />
            </div>
            {hasFile && (
              <div className="mt-1">
                <span className="text-xs text-green-600 dark:text-green-400">
                  File selected:{" "}
                  {typeof data.inputs.file === "string"
                    ? data.inputs.file.substring(0, 20) + "..."
                    : data.inputs.file?.name || "Unknown"}
                </span>
              </div>
            )}
          </div>

          {/* Show image preview */}
          {imageUrl && (
            <div className="mt-2">
              <Label className="text-xs mb-1 block">Image Preview</Label>
              <div className="border rounded-md overflow-hidden w-full max-h-32 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-32 object-contain"
                />
              </div>
            </div>
          )}

          {/* Display extracted text preview (truncated) */}
          {hasOutput && data.outputs.text && (
            <div className="mt-2">
              <Label className="text-xs mb-1 block">
                Extracted Text Preview
              </Label>
              <div className="text-xs border rounded-md p-2 max-h-24 overflow-auto bg-muted">
                {data.outputs.text.length > 150
                  ? `${data.outputs.text.substring(0, 150)}...`
                  : data.outputs.text}
              </div>
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-teal-500 !w-3 !h-3"
      />
    </div>
  );
}
