"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, timeMessage } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HomePageLoader from "@/components/home-page-loader";
import { PostType } from "@/types/types";
import Link from "next/link";
import { useInfinityScrollFetch } from "@/lib/hooks";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

import { FaHeart } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { likePost } from "@/actions/actions";
import { useSession } from "next-auth/react";

function Page() {
  const { data, error, fetchNextPage } = useInfinityScrollFetch();

  const session = useSession();
  console.log(session);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      console.log("in view");
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  console.log(data);
  if (!data || !session) {
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
              {/* <p>{post.LikeUsers.includes()}</p> */}
              {post ? (
                <div className="flex flex-row items-center justify-between">
                  <div className=" flex items-center gap-2 my-4">
                    <Image
                      src={post?.User?.image}
                      width={30}
                      height={30}
                      alt="user image"
                      className="rounded-full w-6 h-6"
                    />
                    <div className="flex flex-row items-center">
                      <p className="mt-auto text-sm font-semibold ">
                        @{post?.User?.name}
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
                <p className="text-sm font-semibold mb-2">
                  {formatText(post?.postText)}
                </p>
              )}
              <div className="justify-center flex">
                {post?.media && post.media[0].type.startsWith("image") && (
                  <Dialog modal>
                    <DialogTrigger asChild>
                      <Image
                        src={post.media[0].url}
                        width={1200}
                        height={800}
                        quality={100}
                        alt="post image"
                        className="rounded-xl border border-white/30 w-full max-h-[1000px] hover:opacity-75 object-contain transition hover:cursor-pointer"
                      />
                    </DialogTrigger>
                    <DialogTitle></DialogTitle>
                    <DialogContent className="absolute outline-none z-10">
                      <Image
                        src={post.media[0].url}
                        width={1200}
                        height={1000}
                        quality={100}
                        alt="post image"
                        className="rounded-xl border border-white/30 w-full max-h-[1200px] object-contain transition hover:cursor-pointer z-10"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {post?.media && post.media[0].type.startsWith("video") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <video
                        src={post.media[0].url}
                        width={1000}
                        height={800}
                        controls
                        className="rounded-xl border border-white/30 w-full max-h-[600px] object-contain"
                        onClick={(e) => {
                          console.log(e.currentTarget);
                        }}
                      />
                    </DialogTrigger>
                    <DialogTitle></DialogTitle>
                    <DialogContent className="absolute">
                      <DialogDescription></DialogDescription>
                      <video
                        src={post.media[0].url}
                        width={1000}
                        height={800}
                        controls
                        className="rounded-xl border border-white/30 w-full max-h-[600px] object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="flex flex-row justify-between items-center mt-4">
                <div className="flex flex-row gap-8 ">
                  <div className="flex items-center gap-1">
                    {/* Likes */}
                    <FaHeart
                      className={cn("text-sm text-neutral-600 cursor-pointer", {
                        "text-red-500": post.LikeUsers.find(
                          (user) =>
                            user.likedPostUserId === session.data?.userId
                        ),
                      })}
                      onClick={async () => await likePost(post.postId)}
                    />
                    <p className="text-xs font-light">{post.likes}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Comments */}
                    <IoChatbox className="text-neutral-600 text-sm cursor-pointer" />
                    <p className="text-xs font-light">
                      {post?.comments?.length || 0}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-1">
                
                  <FaStar className="text-neutral-600 text-sm cursor-pointer" />
                  <p className="text-xs font-light">{post.stars}</p>
                </div> */}
              </div>
            </div>
          ))
        )}
      </ul>

      <div className="h-[1px]" ref={ref}></div>
    </div>
  );
}

export default Page;
