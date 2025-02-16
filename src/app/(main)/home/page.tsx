"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, timeMessage } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { FaHeart } from "react-icons/fa";

import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import { PagesType, PostType } from "@/types/types";
import CommentDialog from "@/components/comment-dialog";

import PostMainDialog from "@/components/post-main-dialog";
// import formatText from "@/lib/formatText";
import Loading from "@/components/loading";
import Link from "next/link";
import formatText from "@/lib/formatText";
import PostComponent from "@/components/post-component";

function Page() {
  const { data, fetchNextPage, error } = useUserContext();
  const session = useSession();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!data || !session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) {
    return <p>Error, please refresh page</p>;
  }

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar ">
      <ul>
        {data?.pages?.map((posts: PagesType) =>
          posts?.posts?.map((post: PostType) => (
            <PostComponent post={post} key={post.postId} />
          ))
        )}
      </ul>

      <div className="h-[1px]" ref={ref}></div>
    </div>
  );
}

export default Page;
