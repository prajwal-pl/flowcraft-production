import React from "react";
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
  FileText,
  Briefcase,
  Code,
  Database,
  ImageIcon,
  MessageSquare,
  PlusCircle,
  MoreHorizontal,
  Trash,
  Pencil,
  Copy,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const workspaceData = [
  {
    id: 1,
    name: "AI Content Generation",
    description: "Create blog posts and social media content",
    lastUpdated: "2h ago",
    flowCount: 5,
    category: "Content",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 2,
    name: "Data Analytics Pipeline",
    description: "Analyze customer data for insights",
    lastUpdated: "1d ago",
    flowCount: 8,
    category: "Analytics",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 3,
    name: "Image Processing",
    description: "Batch process and enhance product images",
    lastUpdated: "3d ago",
    flowCount: 3,
    category: "Media",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    id: 4,
    name: "Customer Support Bot",
    description: "Automated responses for customer inquiries",
    lastUpdated: "5d ago",
    flowCount: 6,
    category: "Support",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 5,
    name: "Document Summarization",
    description: "Extract key information from documents",
    lastUpdated: "1w ago",
    flowCount: 4,
    category: "Document",
    icon: <FileText className="h-4 w-4" />,
  },
];

const WorkspacePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Workspaces</h1>
          <p className="text-zinc-400 text-sm">
            Manage your workflow projects and associated flows
          </p>
        </div>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
          <PlusCircle className="mr-1 h-4 w-4" /> New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workspaceData.map((workspace) => (
          <div key={workspace.id} className="group">
            <Card className="hover:bg-zinc-800 transition-colors bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700">
              <CardHeader className="p-2 flex flex-row items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className="rounded-md p-1.5 bg-zinc-800 text-zinc-400">
                    {workspace.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold group-hover:text-white transition-colors line-clamp-1">
                      {workspace.name}
                    </CardTitle>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-800 text-zinc-100 border-zinc-700"
                  >
                    <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-zinc-700 hover:text-zinc-100">
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-zinc-700 hover:text-zinc-100">
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-zinc-700 hover:text-zinc-100">
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem className="flex items-center cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-500">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <Link
                href={`/workspace/editor/${workspace.id}`}
                className="block"
              >
                <CardContent className="px-4 pb-1">
                  <p className="text-zinc-400 text-sm">
                    {workspace.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 py-2 border-t border-zinc-800">
                  <div className="flex justify-between items-center w-full text-zinc-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{workspace.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />
                      <span>{workspace.flowCount}</span>
                    </div>
                  </div>
                </CardFooter>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
