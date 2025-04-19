"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto flex flex-col">
          <MobileNav />
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
