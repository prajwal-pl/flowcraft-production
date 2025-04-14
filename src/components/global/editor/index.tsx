"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  XYPosition,
} from "@xyflow/react";
import { NodeData, FlowNode } from "@/types/nodes";
import { v4 as uuidv4 } from "uuid";
import SidePanel from "./side-panel";
import { nodeConfigs, nodeTypes } from "@/types/nodeTypes";
import { Button } from "@/components/ui/button";
import { Loader2, PanelLeftIcon, PanelRightIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import "@xyflow/react/dist/style.css";

const Editor = () => {
  // Use our FlowNode type for better type safety
  const initialNodes: FlowNode[] = [];
  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const isMobile = useIsMobile();
  const [sidePanelOpen, setSidePanelOpen] = useState(!isMobile);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
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

  const handleRunWorkflow = () => {
    setIsRunning(true);
    // Workflow execution logic will go here
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
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
            className="bg-background border border-border rounded-md shadow-sm"
            showInteractive={!isMobile}
          />
          {!isMobile && (
            <MiniMap
              className="bg-background border border-border rounded-md shadow-sm"
              nodeColor="var(--color-primary)"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          )}
          <Background
            // @ts-ignore
            variant="dots"
            gap={12}
            size={1}
            color="var(--color-muted-foreground)"
          />
          <Panel position="top-right">
            <Button
              className="shadow-md"
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
          </Panel>
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
      {sidePanelOpen && (
        <SidePanel
          nodeConfigs={nodeConfigs}
          onClose={isMobile ? toggleSidePanel : undefined}
        />
      )}
    </div>
  );
};

export default Editor;
