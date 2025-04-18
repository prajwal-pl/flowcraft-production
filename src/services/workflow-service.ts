import { TaskType, FlowNode } from "@/types/nodes";
import { Edge } from "@xyflow/react";
import { toast } from "sonner";
import { generateText } from "./text-service";
import { generateAudio, transcribeAudio } from "./audio-service";
import { summarizePDF } from "./pdf-service";
import { generateImage, readImage } from "./image-service";

/**
 * Executes a single node in the workflow
 */
async function executeNode(node: FlowNode): Promise<FlowNode> {
  try {
    const { taskType, inputs } = node.data;
    let outputs = {};

    // Execute the appropriate task based on the node type
    switch (taskType) {
      case TaskType.GENERATE_TEXT:
        const generatedText = await generateText(
          inputs.prompt || "",
          inputs.maxTokens || 500
        );
        outputs = { text: generatedText };
        break;

      case TaskType.GENERATE_IMAGE:
        const imageUrl = await generateImage(
          inputs.prompt || "",
          inputs.size || "512x512"
        );
        outputs = { image: imageUrl };
        break;

      case TaskType.READ_IMAGE:
        const imageResult = await readImage({ file: inputs.file });
        outputs = {
          text: imageResult.text,
          imageUrl: imageResult.imageUrl,
        };
        break;

      case TaskType.GENERATE_AUDIO:
        const audioUrl = await generateAudio(
          inputs.text || "",
          inputs.voice || "en-US"
        );
        outputs = { audio: audioUrl };
        break;

      case TaskType.TRANSCRIBE_AUDIO:
        const transcription = await transcribeAudio(inputs.file);
        outputs = { text: transcription };
        break;

      case TaskType.SUMMARIZE_PDF:
        const summary = await summarizePDF(
          inputs.file,
          inputs.maxLength || 500
        );
        outputs = { summary };
        break;

      default:
        throw new Error(`Unsupported task type: ${taskType}`);
    }

    // Return the updated node with outputs
    return {
      ...node,
      data: {
        ...node.data,
        outputs,
      },
    };
  } catch (error) {
    console.error(`Error executing node ${node.id}:`, error);
    toast.error(`Error in ${node.data.label}`, {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  }
}

/**
 * Builds a directed graph from nodes and edges
 */
function buildGraph(nodes: FlowNode[], edges: Edge[]) {
  const graph = new Map<string, string[]>();
  const incomingEdges = new Map<string, number>();

  // Initialize graph
  for (const node of nodes) {
    graph.set(node.id, []);
    incomingEdges.set(node.id, 0);
  }

  // Add edges to graph
  for (const edge of edges) {
    if (edge.source && edge.target) {
      const neighbors = graph.get(edge.source) || [];
      neighbors.push(edge.target);
      graph.set(edge.source, neighbors);

      // Increment incoming edge count
      incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
    }
  }

  return { graph, incomingEdges };
}

/**
 * Find nodes without incoming edges (starting nodes)
 */
function findStartNodes(
  nodes: FlowNode[],
  incomingEdges: Map<string, number>
): FlowNode[] {
  return nodes.filter((node) => (incomingEdges.get(node.id) || 0) === 0);
}

/**
 * Execute workflow by traversing the graph of nodes and edges
 */
export async function executeWorkflow(
  nodes: FlowNode[],
  edges: Edge[]
): Promise<FlowNode[]> {
  // Show workflow start toast
  toast.info("Workflow Execution Started", {
    description: `Executing workflow with ${nodes.length} nodes`,
  });

  try {
    // Build a directed graph from the nodes and edges
    const { graph, incomingEdges } = buildGraph(nodes, edges);

    // Find starting nodes (nodes with no incoming edges)
    const startNodes = findStartNodes(nodes, incomingEdges);

    if (startNodes.length === 0 && nodes.length > 0) {
      toast.warning("Workflow may contain cycles", {
        description: "No clear starting nodes found in workflow",
      });
      // If no start nodes but we have nodes, just pick the first one as start
      startNodes.push(nodes[0]);
    }

    // Clone the nodes to avoid modifying the original
    const updatedNodes = [...nodes];

    // Process each start node and its descendants
    for (const startNode of startNodes) {
      await processNode(startNode.id, graph, updatedNodes, edges);
    }

    // Show workflow completion toast
    toast.success("Workflow Execution Complete", {
      description: "All tasks have been processed successfully",
    });

    return updatedNodes;
  } catch (error) {
    console.error("Error executing workflow:", error);
    toast.error("Workflow Execution Failed", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  }
}

/**
 * Process a node and all its descendants in the workflow
 */
async function processNode(
  nodeId: string,
  graph: Map<string, string[]>,
  nodes: FlowNode[],
  edges: Edge[]
): Promise<void> {
  // Find the node in the array
  const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
  if (nodeIndex === -1) return;

  // Get the current node
  const node = nodes[nodeIndex];

  try {
    // Before executing, update this node's inputs based on connected nodes' outputs
    updateNodeInputs(nodeId, nodes, edges);

    // Execute the current node with updated inputs
    const updatedNode = await executeNode(node);

    // Update the node in the array
    nodes[nodeIndex] = updatedNode;

    // Process all children
    const children = graph.get(nodeId) || [];
    for (const childId of children) {
      await processNode(childId, graph, nodes, edges);
    }
  } catch (error) {
    console.error(`Error processing node ${nodeId}:`, error);
    // Continue with other nodes even if one fails
  }
}

/**
 * Updates a specific node's inputs based on its connected source nodes
 */
function updateNodeInputs(
  targetNodeId: string,
  nodes: FlowNode[],
  edges: Edge[]
): void {
  // Find all edges where this node is the target
  const incomingEdges = edges.filter((edge) => edge.target === targetNodeId);

  if (incomingEdges.length === 0) return;

  const targetNode = nodes.find((n) => n.id === targetNodeId);
  if (!targetNode) return;

  // For each incoming edge, update the target node's inputs
  for (const edge of incomingEdges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode || !sourceNode.data.outputs) continue;

    const outputs = sourceNode.data.outputs;

    // Handle different output types
    for (const [key, value] of Object.entries(outputs)) {
      // Handle text outputs (text, summary)
      if (key === "text" || key === "summary") {
        if (targetNode.data.taskType === TaskType.GENERATE_AUDIO) {
          // Special handling for Audio node
          targetNode.data.inputs.text = value;
          console.log(
            `Setting text input for audio node ${targetNodeId}: ${value}`
          );
        } else if ("text" in targetNode.data.inputs) {
          targetNode.data.inputs.text = value;
        } else if ("prompt" in targetNode.data.inputs) {
          targetNode.data.inputs.prompt = value;
        }
      }
      // Handle file-type inputs (images, audio)
      else if (
        (key === "image" || key === "imageUrl" || key === "audio") &&
        "file" in targetNode.data.inputs
      ) {
        targetNode.data.inputs.file = value;
      }
    }
  }
}

/**
 * Pass data from source nodes to target nodes
 * This function updates input fields of nodes based on connections
 */
export function passDataBetweenNodes(
  nodes: FlowNode[],
  edges: Edge[]
): FlowNode[] {
  const updatedNodes = [...nodes];

  for (const edge of edges) {
    if (!edge.source || !edge.target) continue;

    const sourceNode = updatedNodes.find((n) => n.id === edge.source);
    const targetNode = updatedNodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode || !sourceNode.data.outputs) continue;

    // Get output from source node
    const outputs = sourceNode.data.outputs;

    // Update inputs of target node based on source outputs
    for (const [key, value] of Object.entries(outputs)) {
      // Special case for text-based outputs (text, summary, transcription)
      if (key === "text" || key === "summary") {
        // Handle text outputs to various inputs
        if ("text" in targetNode.data.inputs) {
          targetNode.data.inputs.text = value;
          console.log(`Passing text data to ${targetNode.id}: ${value}`);
        } else if ("prompt" in targetNode.data.inputs) {
          targetNode.data.inputs.prompt = value;
          console.log(
            `Passing text data as prompt to ${targetNode.id}: ${value}`
          );
        }
      }
      // Handle image outputs
      else if (
        (key === "image" || key === "imageUrl") &&
        "file" in targetNode.data.inputs
      ) {
        targetNode.data.inputs.file = value;
      }
      // Handle audio outputs
      else if (key === "audio" && "file" in targetNode.data.inputs) {
        targetNode.data.inputs.file = value;
      }
    }

    // Special case for Generate Audio node (needs text input)
    if (targetNode.data.taskType === TaskType.GENERATE_AUDIO) {
      // Check all possible text outputs from source
      if ("text" in sourceNode.data.outputs) {
        targetNode.data.inputs.text = sourceNode.data.outputs.text;
      } else if ("summary" in sourceNode.data.outputs) {
        targetNode.data.inputs.text = sourceNode.data.outputs.summary;
      }
    }
  }

  return updatedNodes;
}
