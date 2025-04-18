"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// CREATE - Create a new workflow
export const createWorkflow = async (workflowData: {
  name: string;
  description?: string;
  isPublic?: boolean;
  nodes: any;
  edges: any;
}) => {
  const { userId } = await auth();
  console.log(userId);

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const workflow = await db.workflow.create({
      data: {
        ...workflowData,
        userId,
      },
    });

    return workflow;
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
};

// READ - Get all workflows for the current user
export const getAllWorkflows = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const workflows = await db.workflow.findMany({
      where: {
        userId,
      },
    });

    if (!workflows || workflows.length === 0) {
      return [];
    }

    return workflows;
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
};

// READ - Get a single workflow by ID
export const getWorkflowById = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const workflow = await db.workflow.findUnique({
      where: {
        id,
      },
      include: {
        executions: true,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Check if the user owns this workflow or if it's public
    if (workflow.userId !== userId && !workflow.isPublic) {
      throw new Error("Unauthorized access to workflow");
    }

    return workflow;
  } catch (error) {
    console.error("Error fetching workflow:", error);
    throw error;
  }
};

// READ - Get public workflows
export const getPublicWorkflows = async () => {
  try {
    const workflows = await db.workflow.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return workflows;
  } catch (error) {
    console.error("Error fetching public workflows:", error);
    throw error;
  }
};

// UPDATE - Update an existing workflow
export const updateWorkflow = async (
  id: string,
  workflowData: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    nodes?: any;
    edges?: any;
  }
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    // First check if the workflow exists and belongs to the user
    const existingWorkflow = await db.workflow.findUnique({
      where: {
        id,
      },
    });

    if (!existingWorkflow) {
      throw new Error("Workflow not found");
    }

    if (existingWorkflow.userId !== userId) {
      throw new Error("Unauthorized to update this workflow");
    }

    const updatedWorkflow = await db.workflow.update({
      where: {
        id,
      },
      data: {
        ...workflowData,
        updatedAt: new Date(),
      },
    });

    return updatedWorkflow;
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
};

// UPDATE - Update workflow execution time
export const updateWorkflowExecutionTime = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const workflow = await db.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        lastExecuted: new Date(),
      },
    });

    return workflow;
  } catch (error) {
    console.error("Error updating workflow execution time:", error);
    throw error;
  }
};

// DELETE - Delete a workflow
export const deleteWorkflow = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    // First check if the workflow exists and belongs to the user
    const existingWorkflow = await db.workflow.findUnique({
      where: {
        id,
      },
    });

    if (!existingWorkflow) {
      throw new Error("Workflow not found");
    }

    if (existingWorkflow.userId !== userId) {
      throw new Error("Unauthorized to delete this workflow");
    }

    // Delete the workflow
    await db.workflow.delete({
      where: {
        id,
      },
    });

    return { success: true, message: "Workflow deleted successfully" };
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
};

// CREATE - Record a workflow execution
export const createWorkflowExecution = async (
  workflowId: string,
  data: {
    status: string;
    completedAt?: Date;
    executionTime?: number;
    error?: string;
    results?: any;
  }
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    // First check if the workflow exists and belongs to the user
    const workflow = await db.workflow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    if (workflow.userId !== userId) {
      throw new Error("Unauthorized to execute this workflow");
    }

    // Create execution record
    const execution = await db.workflowExecution.create({
      data: {
        ...data,
        workflowId,
      },
    });

    // Update the workflow's lastExecuted timestamp
    await db.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        lastExecuted: new Date(),
      },
    });

    return execution;
  } catch (error) {
    console.error("Error recording workflow execution:", error);
    throw error;
  }
};

// READ - Get workflow executions
export const getWorkflowExecutions = async (workflowId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    // First check if the workflow exists and belongs to the user
    const workflow = await db.workflow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    if (workflow.userId !== userId && !workflow.isPublic) {
      throw new Error("Unauthorized to access this workflow's executions");
    }

    // Get execution history
    const executions = await db.workflowExecution.findMany({
      where: {
        workflowId,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return executions;
  } catch (error) {
    console.error("Error fetching workflow executions:", error);
    throw error;
  }
};
