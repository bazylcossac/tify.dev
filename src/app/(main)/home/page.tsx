"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, timeMessage } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import HomePageLoader from "@/components/home-page-loader";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { likePost } from "@/actions/actions";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import { PagesType, PostType } from "@/types/types";
import CommentDialog from "@/components/comment-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CommentsComponent from "@/components/comments-component";

function Page() {
  const { data, fetchNextPage, error, refetch } = useUserContext();

  const session = useSession();
  console.log(session);
  console.log(data);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      console.log("in view");
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!data || !session) {
    return <HomePageLoader />;
  }
  if (error) {
    return <p>Error, please refresh page</p>;
  }

  const formatText = (text: string) => {
    return text
      .split(/(#\S+|https?:\/\/www\.youtube\.com\/watch\S+)/g)
      .map((part, index) =>
        part.startsWith("#") ? (
          <Link href={`explore/${part.slice(1)}`} key={index}>
            <span className="text-blue-500 font-bold">{part}</span>
          </Link>
        ) : part.startsWith("https://www.youtube.com/watch") ? (
          <Link href={part} target="_blank" key={index}>
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
        {data?.pages?.map((posts: PagesType) =>
          posts?.posts?.map((post: PostType) => (
            <div
              key={post.postId}
              className="flexf flex-col mx-4 border-b border-white/30 py-4"
            >
              {post ? (
                <div className="flex flex-row items-center justify-between">
                  <div className=" flex items-center gap-2 my-4 ">
                    <Image
                      src={post?.User?.image}
                      width={30}
                      height={30}
                      alt="user image"
                      className="rounded-full w-8 h-8"
                    />
                    <div className="flex flex-row items-center">
                      <p className="mt-auto text-md font-semibold ">
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
                <p className="text-sm font-semibold mb-2 whitespace-pre-line">
                  {formatText(post?.postText)}
                </p>
              )}
              <div className="justify-center flex">
                {post?.media && post.media[0].type.startsWith("image") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Image
                        src={post.media[0].url}
                        width={1200}
                        height={800}
                        quality={100}
                        alt="post image"
                        className="rounded-xl border border-white/30 w-full max-h-[900px] hover:opacity-75  object-contain transition hover:cursor-pointer"
                      />
                    </DialogTrigger>
                    <DialogTitle></DialogTitle>
                    <DialogContent className="bg-[#0D0D0D] border-none flex flex-row max-w-[1200px] max-h-[720px] p-4 rounded-lg">
                      <div className="flex flex-col ">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-2 items-center">
                            <Image
                              src={post.User.image}
                              width={30}
                              height={30}
                              alt="user image"
                              className="rounded-full w-6 h-6"
                            />
                            <div className="flex items-center">
                              <p className="mt-auto text-sm font-semibold">
                                @{post?.User?.name}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs">
                              {" "}
                              {timeMessage(post?.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Image
                          src={post.media[0].url}
                          width={1800}
                          height={1400}
                          quality={100}
                          placeholder="blur"
                          blurDataURL="public/images/noImage.jpg"
                          alt="post image"
                          className="rounded-xl border border-white/30 max-w-[680px] max-h-[650px] transition object-contain"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        {/* ----- COMMENTS ----- */}
                        <CommentsComponent post={post} />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {post.postText.includes("https://www.youtube.com/watch") && (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      post.postText.split("=")[1]
                    }`}
                    className="w-full h-[500px] rounded-lg"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
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
                      />
                    </DialogTrigger>
                    <DialogTitle></DialogTitle>
                    <DialogContent>
                      <DialogDescription></DialogDescription>
                      <video
                        src={post.media[0].url}
                        width={1000}
                        height={800}
                        controls
                        className="rounded-xl border border-white/30 w-full max-h-[600px] object-contain"
                      >
                        <source
                          src={post.media[0].url}
                          type={post.media[0].type}
                        />
                      </video>
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
                        "text-red-500": post.LikeUsers.some(
                          (user) =>
                            user.likedPostUserId === session.data?.userId
                        ),
                      })}
                      onClick={async () => {
                        await likePost(post.postId);

                        refetch();
                      }}
                    />
                    <p className="text-xs font-light">{post.likes}</p>
                  </div>

                  <CommentDialog post={post} />
                </div>
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
