"use client";
import HomeSidebar from "@/components/home-sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <>
      <div className="flex justify-center mt-4 ">
        <div className="sticky top-4 self-start mr-4">
          <HomeSidebar />
        </div>

        <div>
          <div className="min-h-screen w-[600px] p-4 rounded-xl overflow-y-auto no-scrollbar">
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default layout;
