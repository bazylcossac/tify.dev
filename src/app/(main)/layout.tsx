import HomeSidebar from "@/components/home-sidebar";

import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-row justify-center gap-4 mt-4">
        <div className="mx-4">
          <HomeSidebar />
        </div>
        <div className="flex flex-col">
          <div className="min-h-screen w-[600px] mx-4 p-2  rounded-xl overflow-y-auto no-scrollbar ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
