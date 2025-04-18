"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Image,
  Music,
  CheckCircle,
  Clock,
  PieChart,
  BarChart,
  Zap,
  ArrowRight,
  Cpu,
  Code,
  Play,
  Pause,
} from "lucide-react";
import { TaskType } from "@/types/nodes";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";

// Custom audio player component
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      const currentTime = audio.currentTime;
      setCurrentTime(currentTime);

      // Update progress bar width based on current time
      if (progressBarRef.current) {
        const progressPercent = (currentTime / audio.duration) * 100;
        progressBarRef.current.style.width = `${progressPercent}%`;
      }
    };

    // Add event listeners
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      // Cleanup event listeners
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Handle click on progress bar to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const pos =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    audioRef.current.currentTime = pos * audioRef.current.duration;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex justify-center items-center"
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>

        <div className="text-xs w-16 text-muted-foreground">
          {formatTime(currentTime)}
        </div>

        <div
          className="h-1.5 bg-muted flex-1 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            ref={progressBarRef}
            className="h-full bg-primary"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="text-xs w-16 text-right text-muted-foreground">
          {Number.isNaN(duration) ? "0:00" : formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

export default function ResultsView() {
  const { nodes, lastExecutionTime } = useEditorStore();
  const isMobile = useIsMobile();
  const [expandedInput, setExpandedInput] = useState<string | null>(null);

  // Filter only nodes that have results
  const nodesWithResults = nodes.filter(
    (node) => Object.keys(node.data.outputs || {}).length > 0
  );

  // Calculate execution time in seconds (readable format)
  const executionTimeText = lastExecutionTime
    ? `${(lastExecutionTime / 1000).toFixed(2)} seconds`
    : "N/A";

  // Get success percentage
  const successPercentage = nodes.length
    ? Math.round((nodesWithResults.length / nodes.length) * 100)
    : 0;

  // Get a count of nodes by type
  const nodeTypeCount = nodes.reduce((acc, node) => {
    const type = node.data.taskType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Function to get a color for each task type
  const getTaskTypeColor = (taskType: TaskType): string => {
    switch (taskType) {
      case TaskType.GENERATE_TEXT:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
      case TaskType.GENERATE_IMAGE:
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case TaskType.GENERATE_AUDIO:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case TaskType.READ_IMAGE:
        return "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300";
      case TaskType.TRANSCRIBE_AUDIO:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
      case TaskType.SUMMARIZE_PDF:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Function to render appropriate icon for result type
  const getResultIcon = (taskType: TaskType) => {
    switch (taskType) {
      case TaskType.GENERATE_TEXT:
      case TaskType.SUMMARIZE_PDF:
        return <FileText className="h-5 w-5" />;
      case TaskType.GENERATE_IMAGE:
      case TaskType.READ_IMAGE:
        return <Image className="h-5 w-5" />;
      case TaskType.GENERATE_AUDIO:
      case TaskType.TRANSCRIBE_AUDIO:
        return <Music className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  // Helper to truncate text to a reasonable length
  const truncateText = (text: string, maxLength = 500) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Toggle input parameter expansion
  const toggleInputExpansion = (key: string) => {
    if (expandedInput === key) {
      setExpandedInput(null);
    } else {
      setExpandedInput(key);
    }
  };

  // Helper to render result content based on type
  const renderResultContent = (node: (typeof nodes)[0]) => {
    const { taskType } = node.data;
    const outputs = node.data.outputs || {};

    switch (taskType) {
      case TaskType.GENERATE_TEXT:
      case TaskType.TRANSCRIBE_AUDIO:
        return (
          <div className="p-4 bg-muted/30 rounded-md max-h-[500px] overflow-auto border border-border/50 shadow-sm prose prose-sm dark:prose-invert">
            {outputs.text ? (
              <ReactMarkdown>{outputs.text}</ReactMarkdown>
            ) : (
              "No text output available"
            )}
          </div>
        );
      case TaskType.SUMMARIZE_PDF:
        return (
          <div className="space-y-4">
            {/* Display the filename if available */}
            {node.data.inputs?.file && (
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="font-medium">
                  Source:{" "}
                  {typeof node.data.inputs.file === "string"
                    ? node.data.inputs.file.split("/").pop()
                    : node.data.inputs.file instanceof File
                    ? node.data.inputs.file.name
                    : "Unknown file"}
                </span>
              </div>
            )}
            <div className="p-4 bg-amber-50/30 dark:bg-amber-950/20 rounded-md max-h-[500px] overflow-auto border border-amber-200/50 dark:border-amber-900/50 shadow-sm prose prose-sm dark:prose-invert">
              {outputs.summary ? (
                <ReactMarkdown>{outputs.summary}</ReactMarkdown>
              ) : (
                "No summary available"
              )}
            </div>
          </div>
        );
      case TaskType.READ_IMAGE:
        return (
          <div className="space-y-4">
            {outputs.imageUrl && (
              <div className="mt-2 flex flex-col gap-2">
                <h4 className="text-sm font-medium">Source Image</h4>
                <div className="flex justify-center border rounded-md p-2 bg-background/80">
                  <img
                    src={outputs.imageUrl}
                    alt="Source image"
                    className="max-w-full max-h-[300px] rounded-md object-contain"
                  />
                </div>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium mb-2">Extracted Text</h4>
              <div className="p-4 bg-muted/30 rounded-md max-h-[500px] overflow-auto border border-border/50 shadow-sm prose prose-sm dark:prose-invert">
                {outputs.text ? (
                  <ReactMarkdown>{outputs.text}</ReactMarkdown>
                ) : (
                  "No text output available"
                )}
              </div>
            </div>
          </div>
        );
      case TaskType.GENERATE_IMAGE:
        return outputs.image ? (
          <div className="mt-2 flex justify-center">
            <img
              src={outputs.image}
              alt="Generated image"
              className="max-w-full rounded-md border shadow-sm hover:shadow-md transition-shadow"
            />
          </div>
        ) : (
          <div className="p-4 bg-muted/30 rounded-md border border-border/50">
            No image output available
          </div>
        );
      case TaskType.GENERATE_AUDIO:
        return outputs.audio ? (
          <div className="mt-2 p-3 bg-muted/20 rounded-md border border-border/50 shadow-sm">
            <AudioPlayer src={outputs.audio} />
          </div>
        ) : (
          <div className="p-4 bg-muted/30 rounded-md border border-border/50">
            No audio output available
          </div>
        );
      default:
        return <div>Unsupported result type</div>;
    }
  };

  // Get node status badges
  const getStatusBadge = (node: (typeof nodes)[0]) => {
    const hasOutput = Object.keys(node.data.outputs || {}).length > 0;
    return hasOutput ? (
      <Badge
        variant="default"
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
      >
        <CheckCircle className="h-3 w-3 mr-1" /> Success
      </Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    );
  };

  return (
    // Adding flex layout and making sure the container fills available height
    <div className="flex flex-col h-full w-full overflow-hidden animate-in fade-in duration-300">
      {/* Main container with responsive layout - proper height constraints */}
      <div
        className={cn(
          "w-full h-full overflow-auto",
          isMobile ? "flex flex-col gap-4 p-2" : "flex gap-4 p-2"
        )}
      >
        {/* Summary Cards Column */}
        <div
          className={cn(
            "flex flex-col",
            isMobile ? "w-full" : "w-1/3 h-full overflow-auto"
          )}
        >
          {/* Removed overflow-hidden from Card to allow scrolling */}
          <Card className="mb-4 border shadow-sm">
            <CardHeader className="pb-2 bg-primary/5">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Workflow Results</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                    Completed in {executionTimeText}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Stats cards with enhanced visuals */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/10 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Cpu className="h-4 w-4 mr-1.5 text-primary" />
                      Processing Stats
                    </h3>
                    <Badge variant="outline" className="bg-background">
                      {nodes.length} Nodes
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Completion
                        </span>
                        <span className="text-xs font-medium">
                          {nodesWithResults.length}/{nodes.length}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress
                          className="h-2 bg-primary/20"
                          value={
                            (nodesWithResults.length /
                              Math.max(nodes.length, 1)) *
                            100
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Success Rate
                        </span>
                        <span className="text-xs font-medium">
                          {successPercentage}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress
                          className={cn(
                            "h-2",
                            successPercentage > 80
                              ? "bg-green-200"
                              : successPercentage > 50
                              ? "bg-amber-200"
                              : "bg-red-200"
                          )}
                          value={successPercentage}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node distribution visualization */}
                <div className="rounded-lg border p-4 shadow-sm">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <PieChart className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Node Distribution
                  </h3>

                  <div className="space-y-2">
                    {Object.entries(nodeTypeCount).map(([type, count]) => {
                      const taskType = type as TaskType;
                      const percentage = Math.round(
                        (count / nodes.length) * 100
                      );
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full mr-2",
                                  getTaskTypeColor(taskType).split(" ")[0] // Just get the background color
                                )}
                              />
                              <span className="text-xs font-medium">
                                {type}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "absolute top-0 left-0 h-full rounded-full",
                                getTaskTypeColor(taskType).split(" ")[0] // Just get the background color
                              )}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Empty state if no results */}
                {nodesWithResults.length === 0 && (
                  <Card className="bg-muted/20 border border-dashed flex flex-col items-center justify-center py-6 px-4">
                    <div className="rounded-full bg-muted/30 p-3 mb-2">
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No results available yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Run your workflow to process the nodes and see results
                      here
                    </p>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Outputs Column */}
        <div
          className={cn(
            "flex flex-col",
            // Fixed flex and overflow handling for both mobile and desktop
            isMobile ? "w-full" : "w-2/3 h-full overflow-auto"
          )}
        >
          {nodesWithResults.length > 0 ? (
            // Using flex layout for proper height distribution
            <Card className="border shadow-sm h-full flex flex-col">
              <CardHeader className="pb-2 bg-primary/5 relative flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Node Outputs</CardTitle>
                    <CardDescription>
                      {nodesWithResults.length} nodes generated results
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow overflow-hidden">
                {/* Using flex column with proper height distribution */}
                <Tabs
                  defaultValue={nodesWithResults[0]?.id}
                  className="flex flex-col h-full"
                >
                  <TabsList className="px-4 py-1 border-b overflow-auto flex-shrink-0 bg-muted/30 rounded-none justify-start">
                    {nodesWithResults.map((node) => {
                      const colorClass = getTaskTypeColor(node.data.taskType);
                      return (
                        <TooltipProvider key={node.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TabsTrigger
                                value={node.id}
                                className={cn(
                                  "flex items-center gap-1.5 my-1 transition-all data-[state=active]:shadow-sm",
                                  "data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                )}
                              >
                                <div
                                  className={cn("p-1 rounded-md", colorClass)}
                                >
                                  {getResultIcon(node.data.taskType)}
                                </div>
                                <span>{node.data.label}</span>
                              </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              {node.data.taskType}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </TabsList>

                  {/* Proper height allocation for desktop and mobile */}
                  <div
                    className="overflow-auto flex-grow"
                    style={{
                      maxHeight: isMobile
                        ? "calc(100vh - 400px)"
                        : "calc(100% - 48px)",
                    }}
                  >
                    {nodesWithResults.map((node) => (
                      <TabsContent
                        key={node.id}
                        value={node.id}
                        className="p-0 data-[state=active]:block"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center">
                                <div
                                  className={cn(
                                    "p-1.5 rounded-md mr-2",
                                    getTaskTypeColor(node.data.taskType)
                                  )}
                                >
                                  {getResultIcon(node.data.taskType)}
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {node.data.label}
                                </h3>
                              </div>
                              <p className="text-muted-foreground text-sm mt-1">
                                Type:{" "}
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {node.data.taskType}
                                </Badge>
                              </p>
                            </div>
                            {getStatusBadge(node)}
                          </div>

                          {/* Input parameters in a card */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <ArrowRight className="h-3.5 w-3.5 mr-1" />
                              Input Parameters
                            </h4>
                            <Card className="bg-muted/10 border-border/50">
                              <CardContent className="p-4 space-y-2">
                                {Object.entries(node.data.inputs || {}).map(
                                  ([key, value]) => {
                                    const isLongValue =
                                      typeof value === "string" &&
                                      value.length > 50;
                                    const isExpanded =
                                      expandedInput === `${node.id}-${key}`;

                                    return (
                                      <div key={key} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium">
                                            {key}:
                                          </span>

                                          {isLongValue && (
                                            <Badge
                                              variant="outline"
                                              className="cursor-pointer text-xs hover:bg-muted/50"
                                              onClick={() =>
                                                toggleInputExpansion(
                                                  `${node.id}-${key}`
                                                )
                                              }
                                            >
                                              {isExpanded
                                                ? "Collapse"
                                                : "Expand"}
                                            </Badge>
                                          )}
                                        </div>

                                        <div
                                          className={cn(
                                            "text-sm text-muted-foreground bg-background/50 p-2 rounded border border-border/50",
                                            isLongValue &&
                                              "overflow-hidden transition-all duration-200"
                                          )}
                                        >
                                          {typeof value === "string"
                                            ? isLongValue
                                              ? isExpanded
                                                ? value
                                                : truncateText(value, 50)
                                              : value
                                            : JSON.stringify(value)}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </CardContent>
                            </Card>
                          </div>

                          {/* Result content */}
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Zap className="h-4 w-4 mr-1 text-primary" />
                              Output
                            </h4>
                            {renderResultContent(node)}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col items-center justify-center border-dashed border-2 bg-muted/5">
              <div className="text-center py-10 px-6 max-w-md">
                <div className="mx-auto rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Run your workflow to process nodes and see detailed results
                  here. Results will display output from each node in your
                  workflow.
                </p>
                <div className="p-4 bg-muted/20 rounded-lg border text-sm text-muted-foreground">
                  <p className="mb-2 font-medium">Tip:</p>
                  <p>
                    After running your workflow, you'll see detailed output from
                    each node here, organized in an interactive tabbed
                    interface.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
