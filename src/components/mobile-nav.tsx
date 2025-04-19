"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav({ title = "FlowCraft" }: { title?: string }) {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <Button
        variant="ghost"
        size="icon"
        className="shadow-none"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="w-10" /> {/* Empty div for balanced layout */}
    </div>
  );
}
