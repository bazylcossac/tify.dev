import HomeSidebar from "@/components/home-sidebar";
import Logo from "@/components/logo";

import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="p-4">
        <Logo />
      </div>

      <div className="flex flex-row justify-center">
        <div className="">
          <HomeSidebar />
        </div>
        <div className="flex flex-col">
          <div className="min-h-screen w-[600px] mx-4  bg-[#0e0e0e] rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
