"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { timeMessage } from "@/lib/utils";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

function Page() {
  const fetchPosts = async (pageParam) => {
    const response = await fetch(`/api/posts?pageParam=${pageParam}`);

    const data = await response.json();
    return data;
  };
  const { data, status, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (!data) {
    return (
      <div className="flex flex-col gap-6">
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

  console.log(data.pages);
  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      <ul>
        {data.pages.map((posts) =>
          posts.posts.map((post) => (
            <div
              key={post.postId}
              className="flexf flex-col mx-4 border-b border-white/30 py-4 "
            >
              {post ? (
                <div className="flex flex-row items-center justify-between">
                  <div className=" flex items-center gap-2 my-4">
                    <Image
                      src={post?.user?.image}
                      width={30}
                      height={30}
                      alt="user image"
                      className="rounded-full w-6 h-6"
                    />
                    <div className="flex flex-row items-center">
                      <p className="mt-auto text-sm font-semibold ">
                        @{post?.user?.name}
                      </p>
                      <p className="text-[11px] text-white/30 mx-2">
                        {new Date(post?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/60 font-semibold">
                      {timeMessage(post?.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 my-4">
                  <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
                  </div>
                </div>
              )}
              {post.postText && (
                <p className="text-sm font-semibold my-2">{post?.postText}</p>
              )}
              <div className="justify-center flex">
                {post.media[0].type.startsWith("image") ? (
                  <Image
                    src={post.media[0].url}
                    width={800}
                    height={600}
                    quality={100}
                    alt="post image"
                    className="rounded-lg border border-white/30 w-full max-h-[600px] object-contain"
                  />
                ) : (
                  <video
                    src={post.media[0].url}
                    width={800}
                    height={600}
                    controls
                    className="rounded-lg border border-white/30 w-full max-h-[600px] object-contain"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </ul>
      <div ref={ref}></div>
    </div>
  );
}

export default Page;
