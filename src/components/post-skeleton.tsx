import React from "react";
import { Skeleton } from "./ui/skeleton";
function PostSkeleton() {
  return (
    <div className="mx-4 flex items-center flex-col space-x-4 my-4">
      <div className="flex flex-row w-full  justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full bg-[#141414] animate-pulse" />
          <Skeleton className="h-4 min-w-[100px] bg-[#141414] animate-pulse" />
        </div>
        <div>
          <Skeleton className="h-4 min-w-[50px] bg-[#141414] animate-pulse" />
        </div>
      </div>
      <Skeleton className="h-24 min-w-full bg-[#141414] animate-pulse" />
    </div>
  );
}

export default PostSkeleton;
