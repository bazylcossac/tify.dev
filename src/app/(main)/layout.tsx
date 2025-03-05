import HomeSidebar from "@/components/home-sidebar";
import Loading from "@/components/loading";
import Logo from "@/components/logo";
import { MobileSidebar } from "@/components/mobile-components/mobile-sidebar";
import UserContextProvider from "@/contexts/userContextProvider";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React, { Suspense } from "react";
import QueryClientWrapper from "@/components/query-client-wrapper";

function Layout({ children }: { children: React.ReactNode }) {
  // const queryClient = new QueryClient();
  // const session = useSession();

  // if (session.status === "unauthenticated") {
  //   redirect("/");
  // }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between">
        {/* <QueryClientProvider client={queryClient}> */}
        <QueryClientWrapper>
          <UserContextProvider>
            {/* DESKOP SIDEBAR */}
            <div className="md:sticky md:top-0 md:self-start md:border-none hidden md:flex md:justify-end w-1/4 ">
              <HomeSidebar />
            </div>

            {/* MOBILE SIDEBAR */}
            <div className="flex flex-row justify-between md:hidden py-2 sticky top-0 self-start bg-black w-full border-b-[.5px] border-neutral-700 z-10">
              <div>{/* <MobileSidebar /> */}</div>
              <div className="mr-4">
                <Logo />
              </div>
            </div>

            <Suspense fallback={<Loading />}>
              <div className="min-h-screen rounded-xl overflow-y-auto no-scrollbar w-full ">
                {/* <div className="text-center overflow-x-hidden"></div> */}

                {children}
              </div>
            </Suspense>

            <div className="w-1/4"></div>
          </UserContextProvider>
        </QueryClientWrapper>
        {/* </QueryClientProvider> */}
      </div>
    </>
  );
}

export default Layout;
