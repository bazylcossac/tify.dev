"use client";
import HomeSidebar from "@/components/home-sidebar";
import UserContextProvider from "@/contexts/userContextProvider";
import { useInfinityScrollFetch } from "@/lib/hooks";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/");
  }
  const { data, error, fetchNextPage } = useInfinityScrollFetch();

  return (
    <>
      <div className="flex justify-center mt-4">
        <UserContextProvider
          data={data}
          error={error}
          fetchNextPage={fetchNextPage}
        >
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
      </div>
    </>
  );
}

export default Layout;
