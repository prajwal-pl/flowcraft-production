import React from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllWorkflows } from "@/actions/workflows";
import { WorkflowsList } from "./workflows-list";

// Main workspace page - server component
const WorkspacePage = async () => {
  // Fetch actual workflow data
  const workflows = await getAllWorkflows();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Workflows</h1>
          <p className="text-zinc-400 text-sm">
            Manage your workflow projects and associated flows
          </p>
        </div>
        <Link href="/workspace/editor/new">
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
            <PlusCircle className="mr-1 h-4 w-4" /> New Workflow
          </Button>
        </Link>
      </div>

      {/* Use client component for workflow list (to handle name editing) */}
      <WorkflowsList workflowsData={workflows} />
    </div>
  );
};

export default WorkspacePage;
