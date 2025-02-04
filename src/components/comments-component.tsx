"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { prisma } from "@/lib/db";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import { timeMessage } from "@/lib/utils";

function CommentsClient({ post }) {
  const { getComments } = useUserContext();
  const [comments, setCommnets] = useState([]);
  //   const comments = getComments(postId);
  console.log(comments);

  const session = useSession();
  if (!comments) {
    return <p>No posts</p>;
  }

  useEffect(() => {
    async function fetchComments() {
      const comments = await getComments(post.id);
      setCommnets(comments);
    }
    fetchComments();
  }, [post, getComments]);

  if (!session?.data?.user) {
    redirect("/");
  }
  return (
    <>
      <div className="flex flex-col justify-between overflow-y-auto overflow-x-hidden ml-4">
        {comments.map((comment) => (
          <div
            key={comment.commentId}
            className="mt-6 border-b border-white/30 pb-4 m-2"
          >
            <div className="flex flex-row gap-2 items-center ">
              <Image
                src={comment.userImage}
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
              <div>
                <p className="text-xs">{timeMessage(comment?.createdAt)}</p>
              </div>
            </div>
            <div className="mt-2 w-full">
              <p className="mb-2 font-semibold text-xs">
                {comment.commentText}
              </p>
              {comment?.commentMediaType &&
              comment.commentMediaUrl.includes("image") ? (
                <Image
                  src={comment.commentMediaType}
                  width={600}
                  quality={100}
                  height={560}
                  alt="user image"
                  className="rounded-lg max-w-[450px]"
                />
              ) : comment.commentMediaUrl.includes("video") ? (
                <video
                  src={comment.commentMediaType}
                  height={100}
                  controls
                  className="rounded-lg max-w-[450px]"
                >
                  <source
                    src={comment.commentMediaType}
                    type={comment.commentMediaUrl}
                  />
                </video>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="py-4 flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center ">
          <Image
            src={session.data.user.image || "./public/images/noImage.jpg"}
            width={26}
            height={26}
            quality={75}
            alt="user image"
            className="rounded-full my-auto"
          />

          <Input
            className="transition font-semibold placeholder:text-white/50 mb-2 border-none"
            placeholder="Post your reply..."
          />
        </div>
        <div>
          <Button className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 ">
            Post
          </Button>
        </div>
      </div>
    </>
  );
}

export default CommentsClient;
