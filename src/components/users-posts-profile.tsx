"use client";
import { PagesType, PostType } from "@/types/types";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";

import { useInView } from "react-intersection-observer";

import PostComponent from "./post-component";

function UsersPosts({ userPosts }: { userPosts: PagesType[] }) {
  console.log("posts" + userPosts);
  const session = useSession();
  const { fetchNextPage } = useUserContext();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (session.status === "unauthenticated") {
    redirect("/");
  }

  console.log(userPosts);
  return (
    <div>
      <ul>
        {/* {userPosts?.map((posts) =>
          posts?.posts?.map((post: PostType) => (
            <PostComponent post={post} key={post.postId} />
          ))
        )} */}
        {userPosts?.map((post) => (
          <PostComponent post={post} key={post.postId} />
        ))}
      </ul>

      <div className="h-[10px]" ref={ref}></div>
    </div>
  );
}

export default UsersPosts;
