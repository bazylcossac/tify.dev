"use client";
import { PostType } from "@/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, timeMessage } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import formatText from "@/lib/formatText";
import PostMedia from "./post-media";
import { FaHeart } from "react-icons/fa";
import { useUserContext } from "@/contexts/userContextProvider";
import { useSession } from "next-auth/react";
import CommentDialog from "./comment-dialog";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next-nprogress-bar";

import { PiCrownSimpleFill } from "react-icons/pi";

const PostComponent = function PostComponent({ post }: { post: PostType }) {
  const session = useSession();
  const router = useRouter();

  const { ref, inView } = useInView();
  const [postLikes, setPostLikes] = useState(post?.likes);
  const [isLiked, setIsLiked] = useState(
    post?.LikeUsers?.some(
      (user) => user?.likedPostUserId === session.data?.userId
    )
  );
  const { likePostDB, fetchNextPage } = useUserContext();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div
      className="flex flex-col mx-4 border-b border-white/30 py-4 hover:cursor-pointer"
      onClick={() => router.push(`/post/${post?.postId}`)}
    >
      {post ? (
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 my-4 ">
            <Link href={`/profile/${post?.userId}`}>
              <Image
                src={post?.User?.image}
                width={30}
                height={30}
                quality={50}
                alt="user image"
                className="rounded-full md:w-8 md:h-8 w-6 h-6 hover:opacity-65 transition"
                onClick={(e) => e.stopPropagation()}
              />
            </Link>
            <div className="flex flex-row items-center">
              <div
                className="mt-auto md:text-md text-sm font-semibold flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/profile/${post?.userId}`}
                  className="hover:text-white/60 transition"
                >
                  @{post?.User?.name}
                </Link>
                {post?.User?.premium && (
                  <PiCrownSimpleFill className="text-yellow-400" />
                )}
              </div>
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

      {post?.postText && (
        <div
          className="text-sm font-semibold mb-2 whitespace-pre-line"
          key={`${post?.postId}-${post?.createdAt}`}
        >
          {formatText(post?.postText)}
        </div>
      )}
      <div className="justify-center flex w-full">
        {post?.media && post?.media[0].type.startsWith("image") && (
          <>
            <PostMedia type="image" post={post} />
          </>
        )}
        {post?.postText &&
          (() => {
            const match = post.postText.match(
              /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
            );
            const videoId = match ? match[4] : null;

            return videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-[500px] rounded-lg"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null;
          })()}

        {post?.media && post?.media[0]?.type.startsWith("video") && (
          <PostMedia type="video" post={post} />
        )}
      </div>
      <div className="flex flex-row justify-between items-center mt-4">
        <div className="flex flex-row gap-8 ">
          {post?.LikeUsers && (
            <div className="flex items-center gap-1">
              {/* Likes */}
              <FaHeart
                className={cn(
                  "md:text-lg text-sm text-neutral-600 cursor-pointer",
                  {
                    "text-red-500": isLiked,
                  }
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLiked) {
                    setIsLiked(false);
                    setPostLikes((prev) => prev - 1);
                  } else {
                    setIsLiked(true);
                    setPostLikes((prev) => prev + 1);
                  }
                  likePostDB(post);
                }}
              />
              <p className="text-xs font-bold mx-1">{postLikes}</p>
            </div>
          )}

          <CommentDialog post={post} />
        </div>
      </div>
      <div className="h-[1px]" ref={ref}></div>
    </div>
  );
};

export default PostComponent;
