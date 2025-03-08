"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import Loading from "@/components/loading";

import PostComponent from "@/components/post-component";

import AddPostDialog from "@/components/add-post-dialog";
import ScrollRefreshBtn from "@/components/scroll-refresh-btn";

function Page() {
  const session = useSession();
  const { data, error } = useUserContext();
  const [showRefreshBtn, setShowRefreshBtn] = useState(false);

  useEffect(() => {
    const showButton = () => {
      setShowRefreshBtn(window.scrollY > 3000);
    };

    window.addEventListener("scroll", showButton);
    return () => window.removeEventListener("scroll", showButton);
  }, []);

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
    <>
      <div className=" w-full justify-center flex md:mt-8 mt-4 ">
        {showRefreshBtn && <ScrollRefreshBtn />}
      </div>
      {/* MOBILE POST ADD BTN */}
      <div className="fixed bottom-10 right-10 md:hidden">
        <Suspense fallback={<div>loading...</div>}>
          <AddPostDialog />
        </Suspense>
      </div>

      <main className="flex flex-col overflow-y-auto no-scrollbar ">
        <ul>
          {memoizedPosts.map((post) => (
            <PostComponent post={post} key={post?.postId} />
          ))}
        </ul>
      </main>
    </>
  );
}

export default Page;
