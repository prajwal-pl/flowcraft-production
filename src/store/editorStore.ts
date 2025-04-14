import { create } from "zustand";
import { FlowNode } from "@/types/nodes";
import { Edge } from "@xyflow/react";

export type ViewMode = "canvas" | "results";

interface EditorState {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Flow state
  nodes: FlowNode[];
  setNodes: (nodes: FlowNode[]) => void;

  edges: Edge[];
  setEdges: (edges: Edge[]) => void;

  // Execution state
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;

  // Result state
  lastExecutionTime: number | null;
  setLastExecutionTime: (time: number | null) => void;

  // Sidebar state
  sidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
  toggleSidePanel: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  // Default view mode is canvas
  viewMode: "canvas",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Flow state
  nodes: [],
  setNodes: (nodes) => set({ nodes }),

  edges: [],
  setEdges: (edges) => set({ edges }),

  // Execution state
  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),

  // Result state
  lastExecutionTime: null,
  setLastExecutionTime: (time) => set({ lastExecutionTime: time }),

  // Sidebar state
  sidePanelOpen: true, // Default to open on desktop
  setSidePanelOpen: (open) => set({ sidePanelOpen: open }),
  toggleSidePanel: () =>
    set((state) => ({ sidePanelOpen: !state.sidePanelOpen })),
}));
