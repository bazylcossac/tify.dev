import HomeSidebar from "@/components/home-sidebar";

import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-row justify-center gap-4 mt-4">
        <div className="">
          <HomeSidebar />
        </div>
        <div className="flex flex-col">
          <div className="min-h-screen w-[600px]  bg-[#0e0e0e] rounded-xl overflow-y-auto no-scrollbar ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
