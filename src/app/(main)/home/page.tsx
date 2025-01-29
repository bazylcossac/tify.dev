"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { timeMessage } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import HomePageLoader from "@/components/home-page-loader";
import { PostType } from "@/types/types";
import Link from "next/link";
import { useInfinityScrollFetch } from "@/lib/hooks";

function Page() {
  const { data, error, fetchNextPage } = useInfinityScrollFetch();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!data) {
    return <HomePageLoader />;
  }
  if (error) {
    return <p>Error, please refresh page</p>;
  }

  const formatText = (text: string) => {
    return text.split(/(#\S+)/g).map((part, index) =>
      part.startsWith("#") ? (
        <Link href={`explore/${part.slice(1)}`} key={index}>
          <span className="text-blue-500 font-bold">{part}</span>
        </Link>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar ">
      <ul>
        {data.pages.map((posts) =>
          posts.posts.map((post: PostType) => (
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
                <p className="text-sm font-semibold my-2">
                  {formatText(post?.postText)}
                </p>
              )}
              <div className="justify-center flex">
                {post?.media && post.media[0].type.startsWith("image") && (
                  <Image
                    src={post.media[0].url}
                    width={1000}
                    height={800}
                    quality={100}
                    alt="post image"
                    className="rounded-lg border border-white/30 w-full max-h-[600px] object-contain"
                  />
                )}
                {post?.media && post.media[0].type.startsWith("video") && (
                  <video
                    src={post.media[0].url}
                    width={1000}
                    height={800}
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
