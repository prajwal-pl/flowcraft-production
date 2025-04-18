import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderOpen } from "lucide-react";
import Link from "next/link";

const WorkspacePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-black p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Workspaces</h1>
        <Button className="bg-zinc-700 hover:bg-zinc-600 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example workspace cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Link href={`/workspace/editor/${i}`} key={i}>
            <Card className="hover:shadow-lg transition-all bg-zinc-800/90 border-zinc-700 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">
                  Workspace {i}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-zinc-400 text-sm">
                  <span>Updated 2 days ago</span>
                  <span>{i * 3} flows</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Create new workspace card */}
        <Card className="hover:shadow-lg transition-all border-dashed border-2 border-zinc-700 bg-zinc-800/60 text-white flex flex-col justify-center items-center p-8 cursor-pointer">
          <FolderOpen className="h-12 w-12 text-zinc-500 mb-3" />
          <p className="text-zinc-300 font-medium">Create New Workspace</p>
          <p className="text-zinc-500 text-sm text-center mt-2">
            Start a fresh workflow project
          </p>
        </Card>
      </div>
    </div>
  );
};

export default WorkspacePage;
