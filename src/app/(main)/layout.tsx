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
        <div className="max-h-screen w-[600px] mx-4 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
        
export default layout;
