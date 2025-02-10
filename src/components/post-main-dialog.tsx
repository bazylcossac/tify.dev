"use client";
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";
import CommentsComponent from "./comments-component";
import { PostType } from "@/types/types";
import { timeMessage } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";

function PostMainDialog({
  type,
  post,
}: {
  type: "image" | "video";
  post: PostType;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "image" ? (
          <Image
            src={post.media[0].url}
            width={1200}
            height={800}
            quality={100}
            alt="post image"
            className="rounded-xl border border-white/30 max-h-[500px] hover:opacity-75 object-contain transition hover:cursor-pointer"
          />
        ) : (
          <video
            src={post.media[0].url}
            width={1200}
            height={800}
            ref={videoRef}
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef?.current) {
                videoRef.current.muted = true;
                videoRef.current.pause();
              }
            }}
            controls
            className="rounded-xl border border-white/30 w-full max-h-[500px] object-contain hover:opacity-75 hover:cursor-pointer"
          />
        )}
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent className="bg-[#0D0D0D] md:w-3/4 w-full border-none flex flex-col md:flex-row h-3/4 p-4 rounded-lg overflow-y-auto">
        <div className="flex flex-col border-b-[.5px] border-white/30 pb-4">
          <div className="flex items-center justify-between mb-4 mt-4 md:mt-0 mx-4">
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
              <p className="text-xs"> {timeMessage(post?.createdAt)}</p>
            </div>
          </div>
          {type === "image" ? (
            <Image
              src={post.media[0].url}
              width={1800}
              height={1400}
              quality={100}
              placeholder="blur"
              blurDataURL="public/images/noImage.jpg"
              alt="post image"
              className="rounded-lg min-w-[300px] max-h-[600px] transition object-contain"
            />
          ) : (
            <video
              src={post.media[0].url}
              width={1800}
              height={1400}
              controls
              className="rounded-xl border border-white/30 max-w-[680px] max-h-[600px] object-contain"
            />
          )}
        </div>
        <div className="flex flex-col w-full  h-full">
          {/* ----- COMMENTS ----- */}
          <CommentsComponent post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostMainDialog;
