"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import Loading from "@/components/loading";
import { IoIosRefresh } from "react-icons/io";
import PostComponent from "@/components/post-component";
import { Button } from "@/components/ui/button";

function Page() {
  const session = useSession();
  const { data, error, refetch } = useUserContext();
  const [showRefreshBtn, setShowRefreshBtn] = useState(false);
  console.log("button " + showRefreshBtn);
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
      <div className=" bg-red-300 w-full justify-center flex md:mt-8 mt-4 ">
        {showRefreshBtn && (
          <div className="fixed z-20">
            <Button
              className="bg-blue-500 rounded-full  p-[10px] hover:rotate-180 transition hover:bg-blue-500 active:rotate-180 focus:rotate-180"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                refetch();
              }}
            >
              <IoIosRefresh />
            </Button>
          </div>
        )}
      </div>
      <main className="flex flex-col overflow-y-auto no-scrollbar ">
        <ul>
          {memoizedPosts.map((post) => (
            <PostComponent
              post={post}
              key={`${post.postId}-${post.createdAt}`}
            />
          ))}
        </ul>

        {/* <div className="h-[1px]" ref={ref}></div> */}
      </main>
    </>
  );
}

export default Page;
