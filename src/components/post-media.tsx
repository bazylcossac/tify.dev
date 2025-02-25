"use client";
import React, { useRef } from "react";

import Image from "next/image";

import { PostType } from "@/types/types";

function PostMedia({
  type,
  post,
}: {
  type: "image" | "video";
  post: PostType;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <>
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
          className="rounded-xl border border-white/3 max-h-[500px] object-contain hover:opacity-75 hover:cursor-pointer"
        />
      )}
    </>
  );
}

export default PostMedia;
