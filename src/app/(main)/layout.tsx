"use client";
import HomeSidebar from "@/components/home-sidebar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/");
  }

  return (
    <>
      <div className="flex justify-center mt-4">
        <div className="sticky top-0 self-start ">
          <HomeSidebar />
        </div>

        <div>
          <div className="min-h-screen w-[700px]  rounded-xl overflow-y-auto no-scrollbar">
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </div>
        </div>
        <div className=" w-[200px]"></div>
      </div>
    </>
  );
}

export default Layout;
