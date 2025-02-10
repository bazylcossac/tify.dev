"use client";
import HomeSidebar from "@/components/home-sidebar";
import Logo from "@/components/logo";
import { SheetDemo } from "@/components/mobile-components/mobile-sidebar";
import UserContextProvider from "@/contexts/userContextProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import React, { Suspense } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-center">
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            {/* DESKOP SIDEBAR */}
            <div className="md:sticky md:top-0 md:self-start md:border-none hidden md:inline">
              <HomeSidebar />
            </div>

            {/* MOBILE SIDEBAR */}
            <div className="flex flex-row justify-between md:hidden py-2 sticky top-0 self-start bg-black w-full border-b-[.5px] border-neutral-700">
              <div>
                <SheetDemo />
              </div>
              <div className="mr-4">
                <Logo />
              </div>
            </div>

            <div>
              <div className="min-h-screen rounded-xl overflow-y-auto no-scrollbar">
                <div className="text-right overflow-x-hidden"></div>
                <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
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
