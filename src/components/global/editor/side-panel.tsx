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

interface SidePanelProps {
  nodeConfigs: NodeConfig[];
}

export default function SidePanel({ nodeConfigs }: SidePanelProps) {
  const onDragStart = (event: React.DragEvent, nodeConfig: NodeConfig) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeConfig)
    );
    event.dataTransfer.effectAllowed = "move";
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
    <Card className="w-80 h-full border-l rounded-none shadow-none">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-xl font-semibold">Task Library</CardTitle>
        <CardDescription>
          Drag and drop tasks onto the canvas to build your workflow
        </CardDescription>
      </CardHeader>
      <Separator />
      <ScrollArea className="h-[calc(100vh-130px)]">
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
                        "p-3 rounded-md cursor-grab transition-all",
                        "hover:shadow-md active:shadow-sm border",
                        isGeneration
                          ? "bg-blue-50/50 hover:bg-blue-50"
                          : "bg-amber-50/50 hover:bg-amber-50",
                        "dark:bg-slate-800 dark:hover:bg-slate-700"
                      )}
                      onDragStart={(e) => onDragStart(e, nodeConfig)}
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
