"use client";
import { useUserContext } from "@/contexts/userContextProvider";
import { GetUniqueUserDataType, PostType } from "@/types/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostComponent from "./post-component";

function CurrentUserProfilePosts() {
  const session = useSession();
  const user = session.data?.user;
  const [userData, setUserData] = useState<GetUniqueUserDataType>();

  const { userPosts, fetchNextHomePage, getUniqueUserData } = useUserContext();
  if (!user) {
    redirect("/");
  }

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextHomePage();
    }
  }, [inView, fetchNextHomePage]);

  useEffect(() => {
    const getData = async (userId: string | undefined) => {
      const userData = await getUniqueUserData(userId);
      setUserData(userData);
    };

    getData(session.data?.userId);
  }, [session.data?.userId, getUniqueUserData]);

  return (
    <div>
      <ul>
        {userPosts?.map((posts) =>
          posts?.posts?.map((post: PostType) => (
            <PostComponent post={post} key={post.postId} />
          ))
        )}
      </ul>

      <div className="h-[10px]" ref={ref}></div>
    </div>
  );
}

export default CurrentUserProfilePosts;
