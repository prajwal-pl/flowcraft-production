"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MoreHorizontal,
  Trash,
  Pencil,
  Copy,
  Share2,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateWorkflow, deleteWorkflow } from "@/actions/workflows";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted: Date | null;
  executionCount?: number;
};

type WorkflowsListProps = {
  workflowsData: Workflow[];
  getWorkflowIcon?: (category?: string) => React.ReactNode;
};

const ITEMS_PER_PAGE = 10;

export const WorkflowsList = ({ workflowsData }: WorkflowsListProps) => {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowsData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workflow.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Start editing workflow name
  const handleEditName = (workflow: Workflow) => {
    setEditingId(workflow.id);
    setEditedName(workflow.name);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
  };

  // Save edited name
  const handleSaveName = async (id: string) => {
    if (!editedName.trim()) {
      toast.error("Workflow name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      // Update only the name, preserving all other workflow properties
      await updateWorkflow(id, { name: editedName });

      // Update local state
      setWorkflows(
        workflows.map((w) => (w.id === id ? { ...w, name: editedName } : w))
      );

      toast.success("Workflow name updated");
      setEditingId(null); // Exit edit mode
      router.refresh(); // Refresh the page to get updated data
    } catch (error) {
      console.error("Error updating workflow name:", error);
      toast.error("Failed to update workflow name");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete workflow
  const handleDeleteWorkflow = async (id: string) => {
    const confirmation = confirm(
      "Are you sure you want to delete this workflow? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      await deleteWorkflow(id);
      setWorkflows(workflows.filter((w) => w.id !== id));
      toast.success("Workflow deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting workflow:", error);
      toast.error("Failed to delete workflow");
    }
  };

  // Calculate time since
  const formatTimeAgo = (date: Date | null | string) => {
    if (!date) return "Never";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (workflows.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-white mb-2">
          No workflows yet
        </h3>
        <p className="text-zinc-400 mb-4">
          Create your first workflow to get started
        </p>
        <Link href="/workspace/editor/new">
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
            Create New Workflow
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar in corner with reduced width */}
      <div className="flex justify-end mb-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search workflows..."
            className="bg-zinc-800 border-zinc-700 text-white pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Workflows grid with more compact spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedWorkflows.map((workflow) => (
          <Card
            key={workflow.id}
            className="bg-zinc-900 border-zinc-800 text-white"
          >
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-start">
                {editingId === workflow.id ? (
                  <div className="flex flex-col w-full">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Workflow name"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-zinc-800 text-white"
                        onClick={() => handleSaveName(workflow.id)}
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-zinc-400" />
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                  </div>
                )}

                {editingId !== workflow.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 text-white border-zinc-700">
                      <DropdownMenuItem
                        className="hover:bg-zinc-700 cursor-pointer"
                        onClick={() => handleEditName(workflow)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-700" />
                      <DropdownMenuItem
                        className="hover:bg-red-900 text-red-400 cursor-pointer"
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {workflow.isPublic && (
                <Badge
                  variant="outline"
                  className="mt-1 bg-zinc-800 text-zinc-300 text-xs"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              )}
            </CardHeader>
            <CardContent className="text-zinc-400 py-2 px-4 text-sm">
              {workflow.description || "No description provided."}
            </CardContent>
            <CardFooter className="border-t border-zinc-800 text-xs text-zinc-500 py-2 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {workflow.lastExecuted
                  ? `Last run ${formatTimeAgo(workflow.lastExecuted)}`
                  : "Never run"}
              </div>

              {editingId !== workflow.id && (
                <Link href={`/workspace/editor/${workflow.id}`}>
                  <Button
                    size="sm"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white h-7"
                  >
                    Open
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-zinc-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
