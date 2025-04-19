import Editor from "@/components/global/editor";
import React from "react";

const EditorPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
