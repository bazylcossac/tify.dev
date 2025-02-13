"use client";
import { PostType } from "@/types/types";
import React, { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import PostMainDialog from "./post-main-dialog";
import { Skeleton } from "./ui/skeleton";
import { cn, timeMessage } from "@/lib/utils";
import Image from "next/image";
import CommentDialog from "./comment-dialog";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";

import Loading from "./loading";
import { useInView } from "react-intersection-observer";
import formatText from "@/lib/formatText";

function UsersPosts({ userPosts }) {
  const session = useSession();
  const { fetchNextPage, likePostDB } = useUserContext();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (session.status === "unauthenticated") {
    redirect("/");
  }

    // if (!userPosts) {
    //   return <Loading />;
    // }

  console.log(userPosts);
  return (
    <div>
      <ul>
        {userPosts?.map((posts) =>
          posts?.posts?.map((post: PostType) => (
            <div
              key={post.postId}
              className="flexf flex-col mx-4 border-b border-white/30 py-4"
            >
              {post ? (
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2 my-4 ">
                    <Image
                      src={post?.User?.image}
                      width={30}
                      height={30}
                      priority={true}
                      alt="user image"
                      className="rounded-full md:w-8 md:h-8 w-6 h-6"
                    />
                    <div className="flex flex-row items-center">
                      <p className="mt-auto md:text-md text-sm font-semibold ">
                        @{post?.User?.name}
                      </p>
                      <p className="md:text-[11px] text-[11px] text-white/30 mx-2">
                        {new Date(post?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="md:text-xs text-[11px] text-white/60 font-semibold">
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
                  <>
                    <PostMainDialog type="image" post={post} />
                  </>
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
                  <PostMainDialog type="video" post={post} />
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
                      onClick={() => {
                        likePostDB(post.postId);
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

      <div className="h-[10px]" ref={ref}></div>
    </div>
  );
}

export default UsersPosts;
