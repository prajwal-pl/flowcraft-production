import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BaseNodeProps extends NodeProps {
  data: {
    label: string;
    taskType: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    type?: string;
  };
  isConnectable: boolean;
  inputLabels?: string[];
  outputLabels?: string[];
  icon?: React.ReactNode;
  hasInputHandle?: boolean;
  hasOutputHandle?: boolean;
  className?: string;
}

export const BaseNode = memo((props: BaseNodeProps) => {
  const {
    data,
    isConnectable = true,
    inputLabels = [],
    outputLabels = ["output"],
    icon,
    hasInputHandle = true,
    hasOutputHandle = true,
    className,
  } = props;

  const isMobile = useIsMobile();

  // Increase handle size for mobile
  const handleSize = isMobile ? 12 : 8;

  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-800/90 text-zinc-800 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 shadow-md",
        "p-3 min-w-[180px] touch-manipulation",
        // Add more padding and larger touch targets for mobile
        isMobile && "p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2 border-b pb-2 border-zinc-200 dark:border-zinc-700">
        <div className="rounded-md p-1 bg-zinc-100 dark:bg-zinc-700/50">
          {icon}
        </div>
        <div className="flex-1 truncate text-sm font-medium">{data.label}</div>
      </div>

      {/* Input Handles */}
      {hasInputHandle && (
        <div className="flex flex-col gap-2 mt-1">
          {inputLabels.map((label, index) => (
            <div
              key={`input-${index}`}
              className={cn(
                "flex items-center relative mb-2",
                isMobile ? "h-8" : "h-6" // Increase height for mobile
              )}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`input-${index}`}
                className={cn(
                  "border-2 !bg-zinc-300 dark:!bg-zinc-600 !border-zinc-400 dark:!border-zinc-500",
                  isMobile && "!w-3 !h-3 !left-[-12px]" // Larger handles on mobile
                )}
                style={{
                  width: handleSize,
                  height: handleSize,
                  left: isMobile ? -12 : -8,
                }}
                isConnectable={isConnectable}
              />
              <span className="text-xs ml-2 text-zinc-600 dark:text-zinc-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Output Handles */}
      {hasOutputHandle && (
        <div className="flex flex-col gap-2 mt-2">
          {outputLabels.map((label, index) => (
            <div
              key={`output-${index}`}
              className={cn(
                "flex items-center justify-end relative",
                isMobile ? "h-8" : "h-6" // Increase height for mobile
              )}
            >
              <span className="text-xs mr-2 text-zinc-600 dark:text-zinc-400">
                {label}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={`output-${index}`}
                className={cn(
                  "border-2 !bg-zinc-300 dark:!bg-zinc-600 !border-zinc-400 dark:!border-zinc-500",
                  isMobile && "!w-3 !h-3 !right-[-12px]" // Larger handles on mobile
                )}
                style={{
                  width: handleSize,
                  height: handleSize,
                  right: isMobile ? -12 : -8,
                }}
                isConnectable={isConnectable}
              />
            </div>
          ))}
        </div>
      )}

      {/* Show processing status indicators if needed */}
      {data.type === "processing" && (
        <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-md p-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-700 dark:text-blue-300">
                Processing...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
