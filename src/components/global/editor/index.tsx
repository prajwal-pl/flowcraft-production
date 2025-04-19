"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Save,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  executeWorkflow,
  passDataBetweenNodes,
} from "@/services/workflow-service";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editorStore";
import {
  createWorkflow,
  updateWorkflow,
  getWorkflowById,
  createWorkflowExecution,
  updateWorkflowExecutionTime,
} from "@/actions/workflows";
import { useParams, useRouter } from "next/navigation";
import { sanitizeWorkflowData } from "@/utils/workflow-utils";
import "@xyflow/react/dist/style.css";
import "./styles/flow-styles.css"; // Import custom ReactFlow styles
import "./styles/mobile-flow.css"; // Import mobile-specific styles
import { useSession, useUser } from "@clerk/nextjs";

const Editor = () => {
  const params = useParams();
  const router = useRouter();
  const workflowId = params?.id as string;
  const isNewWorkflow = workflowId === "new";
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isSaving, setIsSaving] = useState(false);

  const { session } = useSession();

  const userId = session?.user.id;
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

  // Load existing workflow if we're editing one
  useEffect(() => {
    const loadWorkflow = async () => {
      if (!isNewWorkflow && workflowId) {
        try {
          const workflow = await getWorkflowById(workflowId);
          if (workflow) {
            setWorkflowName(workflow.name);
            if (workflow.nodes) {
              // Safely parse nodes with proper type conversion
              setNodes(
                JSON.parse(JSON.stringify(workflow.nodes)) as FlowNode[]
              );
            }
            if (workflow.edges) {
              setEdges(JSON.parse(JSON.stringify(workflow.edges)));
            }
          }
        } catch (error) {
          console.error("Error loading workflow:", error);
          toast.error("Failed to load workflow", {
            description: "Could not retrieve the workflow data.",
          });
        }
      }
    };

    loadWorkflow();
  }, [workflowId, isNewWorkflow, setNodes, setEdges]);

  // Save the current workflow
  const saveWorkflow = async () => {
    try {
      setIsSaving(true);
      let savedWorkflow;

      // Sanitize nodes and edges before saving to remove non-serializable data
      const sanitizedNodes = sanitizeWorkflowData(nodes);
      const sanitizedEdges = sanitizeWorkflowData(edges);

      if (isNewWorkflow) {
        // Create a new workflow
        savedWorkflow = await createWorkflow({
          name: workflowName,
          description: "",
          isPublic: false,
          nodes: sanitizedNodes,
          edges: sanitizedEdges,
        });

        // Redirect to the new workflow's page to avoid creating duplicates on refresh
        if (savedWorkflow?.id) {
          router.push(`/workspace/editor/${savedWorkflow.id}`);
        }
      } else {
        // Update existing workflow
        savedWorkflow = await updateWorkflow(workflowId, {
          name: workflowName,
          nodes: sanitizedNodes,
          edges: sanitizedEdges,
        });
      }

      toast.success("Workflow saved successfully", {
        description: `"${workflowName}" has been saved to your workspace.`,
      });

      return savedWorkflow;
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      // Auto-save workflow before running
      const savedWorkflow = await saveWorkflow();
      const currentWorkflowId = savedWorkflow?.id || workflowId;

      if (!currentWorkflowId || isNewWorkflow) {
        throw new Error("Please save your workflow before running it");
      }

      // Update workflow execution time in the database
      await updateWorkflowExecutionTime(currentWorkflowId);

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

      // Sanitize node results before saving to the database
      const sanitizedResults = sanitizeWorkflowData({
        nodeResults: updatedNodes.map((node) => ({
          id: node.id,
          outputs: node.data.outputs,
        })),
      });

      // Record the execution in the database
      await createWorkflowExecution(currentWorkflowId, {
        status: "completed",
        executionTime: executionTime,
        completedAt: new Date(),
        results: sanitizedResults,
      });

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

      // Record failed execution if we have a workflow ID
      if (!isNewWorkflow && workflowId) {
        try {
          await createWorkflowExecution(workflowId, {
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            completedAt: new Date(),
          });
        } catch (execError) {
          console.error("Could not record workflow failure:", execError);
        }
      }

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
        {/* Mobile-only container with stacked layout */}
        <div className={isMobile ? "flex flex-col w-full gap-3" : "hidden"}>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-base font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-2 py-1 w-full"
            placeholder="Untitled Workflow"
          />

          <Tabs
            value={viewMode}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger
                value="canvas"
                className="flex items-center gap-1.5 flex-1"
              >
                <Layers className="h-4 w-4" />
                Canvas
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="flex items-center gap-1.5 flex-1"
              >
                <BarChart className="h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2 w-full">
            <Button
              className="shadow-sm flex-1"
              size="default"
              variant="secondary"
              onClick={saveWorkflow}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <Button
              className="shadow-sm cursor-pointer flex-1"
              size="default"
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
        </div>

        {/* Desktop-only container - keep the original layout */}
        <div className={isMobile ? "hidden" : "flex items-center flex-1"}>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-lg font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-2 py-1 w-64"
            placeholder="Untitled Workflow"
          />

          <div className="ml-4 flex-1">
            <Tabs value={viewMode} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger
                  value="canvas"
                  className="flex items-center gap-1.5"
                >
                  <Layers className="h-4 w-4" />
                  Canvas
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="flex items-center gap-1.5"
                >
                  <BarChart className="h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2">
            <Button
              className="shadow-sm"
              size="sm"
              variant="secondary"
              onClick={saveWorkflow}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <Button
              className="shadow-sm cursor-pointer"
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
        </div>
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
                zoomOnPinch={true}
                panOnDrag={true}
                zoomOnScroll={!isMobile}
                panOnScroll={false}
                proOptions={{ hideAttribution: true }}
              >
                <Controls
                  className="bg-zinc-800/90! border-zinc-700 text-white rounded-md shadow-md"
                  showInteractive={!isMobile}
                  position={isMobile ? "bottom-right" : "bottom-left"}
                  style={
                    isMobile ? { bottom: "20px", right: "20px" } : undefined
                  }
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
          <div className="flex-1 p-2 sm:p-4 overflow-auto">
            <ResultsView />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
