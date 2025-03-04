"use client";
import { useUserContext } from "@/contexts/userContextProvider";
import { PostType } from "@/types/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import PostComponent from "./post-component";

function CurrentUserProfilePosts() {
  const session = useSession();
  const user = session.data?.user;

  const { userPosts, fetchNextHomePage } = useUserContext();
  console.log(userPosts);
  const isThereAnyPosts = useMemo(() => {
    return userPosts?.some((posts) =>
      posts.posts.some((post) => Object.entries(post).length !== 0)
    );
  }, [userPosts]);

  if (!user) {
    redirect("/");
  }

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextHomePage();
    }
  }, [inView, fetchNextHomePage]);

  if (!isThereAnyPosts) {
    return <p className=" text-center text-sm mt-10 text-white/30">No posts</p>;
  }

  return (
    <div>
      <ul>
        {userPosts?.map((posts) =>
          posts?.posts?.map((post: PostType) => (
            <PostComponent
              post={post}
              key={`${post.postId}-${post.createdAt}`}
            />
          ))
        )}
      </ul>

      <div className="h-[10px]" ref={ref}></div>
    </div>
  );
}

export default CurrentUserProfilePosts;
