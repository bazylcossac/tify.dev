"use client";

import React, { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useInView } from "react-intersection-observer";
import PostComponent from "./post-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProfilePosts } from "@/lib/utils";
import Loading from "./loading";
import { Button } from "./ui/button";

function UsersPosts({ userId }: { userId: string }) {
  const session = useSession();

  const { data, isLoading, error, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ["user-posts"],
    queryFn: async ({ pageParam = 1 }) =>
      await fetchProfilePosts(pageParam, userId),
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  const memoizedPosts = useMemo(() => {
    return data?.pages?.flatMap((page) => page.posts) || [];
  }, [data]);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (session.status === "unauthenticated") {
    redirect("/");
  }
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center mt-10">
        <Loading />;
      </div>
    );

  if (error)
    return (
      <div
        className="
       mt-14 flex flex-col items-center justify-center gap-4"
      >
        <p className="font-bold">Failed to fetch posts</p>{" "}
        <Button
          onClick={() => refetch}
          className="px-6 rounded-lg bg-blue-600 hover:bg-[#0c0c0c]"
        >
          Try again
        </Button>
      </div>
    );
  return (
    <div>
      <ul>
        {memoizedPosts?.map((post) => (
          <PostComponent post={post} key={post.postId} />
        ))}
      </ul>

      <div className="h-[10px]" ref={ref}></div>
    </div>
  );
}

export default UsersPosts;
