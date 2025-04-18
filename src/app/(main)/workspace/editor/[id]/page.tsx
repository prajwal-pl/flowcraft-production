import Editor from "@/components/global/editor";
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Settings, Share2 } from "lucide-react";

const EditorPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-900 to-black">
      {/* <header className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-white">Workspace: {params.id}</h1>
          <p className="text-sm text-zinc-400">Last saved 2 minutes ago</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button size="sm" className="bg-zinc-700 hover:bg-zinc-600 text-white">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </header> */}

      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
