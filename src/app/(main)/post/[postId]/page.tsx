"use client";

import { timeMessage } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import PostMedia from "@/components/post-media";
import formatText from "@/lib/formatText";
import { useParams } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";
import Loading from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

function Page() {
  const params = useParams();
  const postId = params?.postId;
  const { getPostByPostId } = useUserContext();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`post-${postId}`],
    queryFn: () => getPostByPostId(postId),
  });

  if (isLoading) {
    return <Loading />;
  }
  console.log(data);
  if (error) {
    return (
      <div>
        <p>Failed to fetch</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-4 px-4 w-full">
      <div className="flex flex-row justify-between items-center gap-2 my-4 w-full ">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={data?.User?.image}
            width={30}
            height={30}
            quality={50}
            alt="user image"
            className="rounded-full md:w-8 md:h-8 w-6 h-6 hover:opacity-65 transition"
          />
          <p className=" md:text-md text-sm font-semibold">
            <Link
              href={`/profile/${data?.userId}`}
              className="hover:text-white/60 transition"
            >
              @{data?.User?.name}
            </Link>
          </p>
          <div className="flex flex-row items-center">
            <p className="md:text-[11px] text-[11px] text-white/30 mx-2">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <p className="md:text-xs text-[11px] text-white/60 font-semibold">
            {timeMessage(data?.createdAt)}
          </p>
        </div>
      </div>

      <div
        className="text-sm font-semibold mb-4 whitespace-pre-line "
        key={`${data?.postId}-${data?.createdAt}`}
      >
        {formatText(data.postText)}
      </div>

      <div className="justify-center flex w-full">
        {data?.media && data?.media[0].type.startsWith("image") && (
          <>
            <PostMedia type="image" post={data} />
          </>
        )}
        {data?.postText?.includes("https://www.youtube.com/watch") && (
          <iframe
            src={`https://www.youtube.com/embed/${
              data?.postText?.split("=")[1].split("\n")[0]
            }`}
            className="w-full h-[500px] rounded-lg"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {data?.media && data?.media[0].type.startsWith("video") && (
          <PostMedia type="video" post={data} />
        )}
      </div>
    </div>
  );
}

export default Page;
