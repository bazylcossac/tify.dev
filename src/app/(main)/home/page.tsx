"use client";

import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";

// import formatText from "@/lib/formatText";
import Loading from "@/components/loading";

import PostComponent from "@/components/post-component";

function Page() {
  const { data, fetchNextHomePage, error } = useUserContext();
  const session = useSession();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextHomePage();
    }
  }, [inView, fetchNextHomePage]);

  const memoizedPosts = useMemo(() => {
    return data?.pages?.flatMap((page) => page.posts) || [];
  }, [data]);

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
        {memoizedPosts.map((post) => (
          <PostComponent post={post} key={post.postId} />
        ))}
      </ul>

      <div className="h-[1px]" ref={ref}></div>
    </div>
  );
}

export default Page;
