"use client";
import { PagesType, PostType } from "@/types/types";
import React, { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";

import { useInView } from "react-intersection-observer";

import PostComponent from "./post-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProfilePosts } from "@/lib/utils";

function UsersPosts({ userId }: { userId: string }) {
  const { data, error, fetchNextPage, refetch } = useInfiniteQuery({
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

  const session = useSession();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (session.status === "unauthenticated") {
    redirect("/");
  }

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
