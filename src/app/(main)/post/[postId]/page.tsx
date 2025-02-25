"use client";

import { timeMessage } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostMedia from "@/components/post-media";
import formatText from "@/lib/formatText";
import { useParams } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";

function Page() {
  const { postId } = useParams();
  console.log(postId);
  const [postData, setPostData] = useState();
  // const { postId } =  await params;
  // const post = await getPostById(postId);
  console.log(postData);
  const { getPostByPostId } = useUserContext();
  const post = getPostByPostId(postId);

  useEffect(() => {
    const getPostData = async () => {
      const post = getPostByPostId(postId);
      setPostData(post);
    };
    if (postId) {
      getPostData();
    }
  }, [post, getPostByPostId, postId]);

  // if (!post) {
  //   return <p>Failed to get a post</p>;
  // }

  return <p>dsa</p>;

  return (
    <div className="flex flex-col my-4 px-4 w-full">
      <div className="flex flex-row justify-between items-center gap-2 my-4 w-full  px-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={post?.User?.image}
            width={30}
            height={30}
            quality={50}
            alt="user image"
            className="rounded-full md:w-8 md:h-8 w-6 h-6 hover:opacity-65 transition"
          />
          <p className=" md:text-md text-sm font-semibold">
            <Link
              href={`/profile/${post.userId}`}
              className="hover:text-white/60 transition"
            >
              @{post?.User?.name}
            </Link>
          </p>
          <div className="flex flex-row items-center">
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

      {post.postText && (
        <div
          className="text-sm font-semibold mb-4 whitespace-pre-line "
          key={`${post.postId}-${post.createdAt}`}
        >
          {formatText(post?.postText)}
        </div>
      )}
      <div className="justify-center flex w-full">
        {post?.media && post.media[0].type.startsWith("image") && (
          <>
            <PostMedia type="image" post={post} />
          </>
        )}
        {post.postText.includes("https://www.youtube.com/watch") && (
          <iframe
            src={`https://www.youtube.com/embed/${
              post.postText.split("=")[1].split("\n")[0]
            }`}
            className="w-full h-[500px] rounded-lg"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {post?.media && post.media[0].type.startsWith("video") && (
          <PostMedia type="video" post={post} />
        )}
      </div>
    </div>
  );
}

export default Page;
