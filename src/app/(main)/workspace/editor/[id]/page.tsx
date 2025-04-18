import Editor from "@/components/global/editor";
import React from "react";

const EditorPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-900 to-black">
      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
