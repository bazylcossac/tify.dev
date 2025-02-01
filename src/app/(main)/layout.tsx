"use client";
import HomeSidebar from "@/components/home-sidebar";
import UserContextProvider from "@/contexts/userContextProvider";

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
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <div className="sticky top-0 self-start ">
              <HomeSidebar />
            </div>

            <div>
              <div className="min-h-screen w-[700px]  rounded-xl overflow-y-auto no-scrollbar">
                {children}
              </div>
            </div>
            <div className=" w-[200px]"></div>
          </UserContextProvider>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default Layout;
