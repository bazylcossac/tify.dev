import React from "react";
import { Skeleton } from "./ui/skeleton";

function HomePageLoader() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row  justify-between mb-8">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
          <div>
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
        </div>
        <Skeleton className=" w-full h-[600px] bg-[#141414] animate-pulse" />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-row  justify-between mb-8">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
          <div>
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
        </div>
        <Skeleton className=" w-full h-[600px] bg-[#141414] animate-pulse" />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-row  justify-between mb-8">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
          <div>
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
        </div>
        <Skeleton className=" w-full h-[600px] bg-[#141414] animate-pulse" />
      </div>
    </div>
  );
}

export default HomePageLoader;
