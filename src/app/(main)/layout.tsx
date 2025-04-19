"use client";

import React, { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isSignedIn } = useSession();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn]);

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
