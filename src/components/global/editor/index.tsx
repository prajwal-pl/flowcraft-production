"use client";

import React, { useCallback, useEffect } from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  XYPosition,
} from "@xyflow/react";
import { NodeData, FlowNode } from "@/types/nodes";
import { v4 as uuidv4 } from "uuid";
import SidePanel from "./side-panel";
import ResultsView from "./results-view";
import { nodeConfigs, nodeTypes } from "@/types/nodeTypes";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  PanelLeftIcon,
  PanelRightIcon,
  Layers,
  BarChart,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  executeWorkflow,
  passDataBetweenNodes,
} from "@/services/workflow-service";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editorStore";
import "@xyflow/react/dist/style.css";
import "./styles/flow-styles.css"; // Import custom ReactFlow styles

const Editor = () => {
  // Get state from Zustand store
  const {
    viewMode,
    setViewMode,
    sidePanelOpen,
    setSidePanelOpen,
    toggleSidePanel,
    isRunning,
    setIsRunning,
    setLastExecutionTime,
  } = useEditorStore();

  // Use React Flow's state management for the flow data
  // We'll sync this with our Zustand store
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const isMobile = useIsMobile();

  // Initialize sidebar state based on mobile detection
  useEffect(() => {
    setSidePanelOpen(!isMobile);
  }, [isMobile, setSidePanelOpen]);

  // Function to find a position that doesn't overlap with existing nodes
  const findNonOverlappingPosition = (
    position: XYPosition,
    nodeSize = { width: 200, height: 150 },
    spacingOffset = 30
  ) => {
    let newPosition = { ...position };
    let overlappingNode = true;
    let safetyCounter = 0; // Prevent infinite loops
    const maxAttempts = 100;

    while (overlappingNode && safetyCounter < maxAttempts) {
      overlappingNode = nodes.some((node) => {
        const dx = Math.abs(node.position.x - newPosition.x);
        const dy = Math.abs(node.position.y - newPosition.y);
        return dx < nodeSize.width && dy < nodeSize.height;
      });

      if (overlappingNode) {
        // Apply diagonal offset to try to find a free space
        newPosition.x += spacingOffset;
        newPosition.y += spacingOffset;
      }

      safetyCounter++;
    }

    return newPosition;
  };

  // Check for pendingNodeAdd from localStorage (mobile touch support)
  useEffect(() => {
    const pendingNodeAdd = localStorage.getItem("pendingNodeAdd");
    if (pendingNodeAdd) {
      try {
        const nodeConfig = JSON.parse(pendingNodeAdd);

        // Create a position for the new node - center of the viewport
        // For a real implementation, you'd want to use ReactFlow's viewport utilities
        const position: XYPosition = {
          x: window.innerWidth / 2 - 100,
          y: window.innerHeight / 2 - 100,
        };

        // Create new node with initialized empty inputs and outputs
        const newNode: FlowNode = {
          id: `${nodeConfig.type}-${uuidv4()}`,
          type: nodeConfig.type,
          position: findNonOverlappingPosition(position),
          data: {
            label: nodeConfig.label,
            taskType: nodeConfig.taskType,
            inputs: nodeConfig.inputs.reduce(
              (acc: Record<string, any>, input: any) => {
                acc[input.name] =
                  input.default !== undefined ? input.default : null;
                return acc;
              },
              {}
            ),
            outputs: {},
          },
        };

        setNodes((nds) => nds.concat(newNode));
        // Clear the pending node
        localStorage.removeItem("pendingNodeAdd");
      } catch (e) {
        console.error("Error adding pending node", e);
        localStorage.removeItem("pendingNodeAdd");
      }
    }
  }, [setNodes, sidePanelOpen]);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeConfigStr = event.dataTransfer.getData("application/reactflow");

      if (!nodeConfigStr) return;

      const nodeConfig = JSON.parse(nodeConfigStr);

      // Get mouse position
      const position: XYPosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Create new node with initialized empty inputs and outputs
      const newNode: FlowNode = {
        id: `${nodeConfig.type}-${uuidv4()}`,
        type: nodeConfig.type,
        position: findNonOverlappingPosition(position),
        data: {
          label: nodeConfig.label,
          taskType: nodeConfig.taskType,
          inputs: nodeConfig.inputs.reduce(
            (acc: Record<string, any>, input: any) => {
              acc[input.name] =
                input.default !== undefined ? input.default : null;
              return acc;
            },
            {}
          ),
          outputs: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update Zustand store when local nodes/edges change
  useEffect(() => {
    // This synchronizes the ReactFlow internal state with our Zustand store
    useEditorStore.setState({ nodes, edges });
  }, [nodes, edges]);

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    const startTime = performance.now();

    try {
      // First, pass data between connected nodes
      const nodesWithPassedData = passDataBetweenNodes(nodes, edges);
      setNodes(nodesWithPassedData);

      // Execute the workflow and get updated nodes with results
      const updatedNodes = await executeWorkflow(nodesWithPassedData, edges);

      // Update the nodes in the UI with results
      setNodes(updatedNodes);

      // Calculate execution time
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      setLastExecutionTime(executionTime);

      // Auto-switch to results view
      setViewMode("results");

      // Close sidebar when showing results
      if (sidePanelOpen) {
        setSidePanelOpen(false);
      }

      // Display a completion toast
      toast.success("Workflow execution completed", {
        description: `Processed in ${(executionTime / 1000).toFixed(
          2
        )} seconds`,
      });
    } catch (error) {
      console.error("Workflow execution failed:", error);
      toast.error("Workflow execution failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTabChange = (value: string) => {
    setViewMode(value as "canvas" | "results");

    // When switching to results view, close the sidebar automatically
    if (value === "results" && sidePanelOpen) {
      setSidePanelOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Tabs at the top */}
      <div className="p-4 border-b bg-background flex items-center">
        <Tabs
          value={viewMode}
          onValueChange={handleTabChange}
          className="flex-1"
        >
          <TabsList>
            <TabsTrigger value="canvas" className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          className="shadow-sm ml-auto"
          size="sm"
          variant="default"
          onClick={handleRunWorkflow}
          disabled={isRunning || nodes.length === 0}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            "Run Workflow"
          )}
        </Button>
      </div>

      {/* Content area */}
      <div className="flex flex-1 relative overflow-hidden">
        {viewMode === "canvas" ? (
          <>
            {/* Canvas View */}
            <div
              className="flex-1 relative"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
              >
                <Controls
                  className="bg-zinc-800/90! border-zinc-700 text-white rounded-md shadow-md"
                  showInteractive={!isMobile}
                />
                {!isMobile && (
                  <MiniMap
                    className="bg-zinc-800/90 border-zinc-700 text-white rounded-md shadow-md"
                    nodeColor="var(--color-primary)"
                    maskColor="rgba(0, 0, 0, 0.4)"
                    pannable
                    zoomable
                  />
                )}
                <Background
                  // @ts-ignore
                  variant="dots"
                  gap={12}
                  size={1}
                  color="var(--color-muted-foreground)"
                />
              </ReactFlow>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 z-10 shadow-md"
                onClick={toggleSidePanel}
              >
                {sidePanelOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
              </Button>
            </div>

            {/* Side Panel */}
            {sidePanelOpen && (
              <SidePanel
                nodeConfigs={nodeConfigs}
                onClose={isMobile ? toggleSidePanel : undefined}
              />
            )}
          </>
        ) : (
          // Results View
          <div className="flex-1 p-4 overflow-auto">
            <ResultsView />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
