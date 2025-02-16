"use client";
import { PostType } from "@/types/types";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, timeMessage } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import formatText from "@/lib/formatText";
import PostMainDialog from "./post-main-dialog";
import { FaHeart } from "react-icons/fa";
import { useUserContext } from "@/contexts/userContextProvider";
import { useSession } from "next-auth/react";
import CommentDialog from "./comment-dialog";

function PostComponent({ post }: { post: PostType }) {
  console.log("RENDERING " + post.postId);
  const { likePostDB } = useUserContext();
  const session = useSession();
  const [isLiked, setIsLiked] = useState(
    post.LikeUsers.some((user) => user.likedPostUserId === session.data?.userId)
  );
  const [postLikes, setPostLikes] = useState(post.likes);

  return (
    <div
      key={post.postId}
      className="flex flex-col mx-4 border-b border-white/30 py-4"
    >
      {post ? (
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 my-4 ">
            <Image
              src={post?.User?.image}
              width={30}
              height={30}
              quality={50}
              alt="user image"
              className="rounded-full md:w-8 md:h-8 w-6 h-6"
            />
            <div className="flex flex-row items-center">
              <p className="mt-auto md:text-md text-sm font-semibold ">
                <Link
                  href={`/profile/${post.userId}`}
                  className="hover:text-white/60 transition"
                >
                  @{post?.User?.name}
                </Link>
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
        <div
          className="text-sm font-semibold mb-2 whitespace-pre-line"
          key={post.postId}
        >
          {formatText(post?.postText)}
        </div>
      )}
      <div className="justify-center flex w-full">
        {post?.media && post.media[0].type.startsWith("image") && (
          <>
            <PostMainDialog type="image" post={post} />
          </>
        )}
        {post.postText.includes("https://www.youtube.com/watch") && (
          <iframe
            src={`https://www.youtube.com/embed/${post.postText.split("=")[1]}`}
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
                "text-red-500": isLiked,
              })}
              onClick={() => {
                if (isLiked) {
                  setIsLiked(false);
                  setPostLikes((prev) => prev - 1);
                } else {
                  setIsLiked(true);
                  setPostLikes((prev) => prev + 1);
                }
                likePostDB(post.postId);
              }}
            />
            <p className="text-xs font-light">{postLikes}</p>
          </div>

          <CommentDialog post={post} />
        </div>
      </div>
    </div>
  );
}

export default PostComponent;
