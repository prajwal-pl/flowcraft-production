"use client";

import React from "react";
import { NodeConfig } from "@/types/nodes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidePanelProps {
  nodeConfigs: NodeConfig[];
  onClose?: () => void;
}

export default function SidePanel({ nodeConfigs, onClose }: SidePanelProps) {
  const isMobile = useIsMobile();

  const onDragStart = (event: React.DragEvent, nodeConfig: NodeConfig) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeConfig)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // For mobile: handle touch-based node creation
  const handleTouchNodeAdd = (nodeConfig: NodeConfig) => {
    if (!isMobile || !onClose) return;

    // Store the node config in localStorage for the editor to pick up
    localStorage.setItem("pendingNodeAdd", JSON.stringify(nodeConfig));
    // Close the panel
    onClose();
  };

  // Group node configs by category
  const categories = {
    "Content Generation": ["generateText", "generateImage", "generateAudio"],
    "Content Analysis": ["summarisePdf", "readImage", "transcribeAudio"],
  };

  const getCategoryNodes = (category: string) => {
    const categoryTypes = categories[category as keyof typeof categories];
    return nodeConfigs.filter((config) => categoryTypes.includes(config.type));
  };

  return (
    <Card
      className={cn(
        "h-full border-l rounded-none shadow-none",
        isMobile ? "w-full fixed top-0 left-0 right-0 z-50" : "w-80"
      )}
    >
      <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Task Library</CardTitle>
          <CardDescription>
            Drag and drop tasks onto the canvas to build your workflow
          </CardDescription>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </CardHeader>
      <Separator />
      <ScrollArea
        className={cn(
          isMobile ? "h-[calc(100vh-130px)]" : "h-[calc(100vh-130px)]"
        )}
      >
        <CardContent className="p-4">
          {Object.keys(categories).map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {getCategoryNodes(category).map((nodeConfig) => {
                  // Assign colors based on category
                  const isGeneration = category === "Content Generation";

                  return (
                    <div
                      key={nodeConfig.type}
                      className={cn(
                        "p-3 rounded-md transition-all",
                        "hover:shadow-md active:shadow-sm border",
                        isGeneration
                          ? "bg-blue-50/50 hover:bg-blue-50"
                          : "bg-amber-50/50 hover:bg-amber-50",
                        "dark:bg-slate-800 dark:hover:bg-slate-700",
                        isMobile ? "cursor-pointer" : "cursor-grab"
                      )}
                      onDragStart={(e) => onDragStart(e, nodeConfig)}
                      onClick={() => handleTouchNodeAdd(nodeConfig)}
                      draggable
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{nodeConfig.label}</span>
                        <Badge
                          variant={isGeneration ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {nodeConfig.inputs.length} input
                          {nodeConfig.inputs.length !== 1 && "s"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
