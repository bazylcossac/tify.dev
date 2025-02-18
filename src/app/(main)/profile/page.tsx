"use client";

import Loading from "@/components/loading";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";
import NextNProgress from "nextjs-progressbar";
import { GetUniqueUserDataType, PostType } from "@/types/types";
import PostComponent from "@/components/post-component";
import { useInView } from "react-intersection-observer";
import ProfileEditDialog from "@/components/profile-edit-dialog";

function Page() {
  const session = useSession();
  const user = session.data?.user;
  const [userData, setUserData] = useState<GetUniqueUserDataType>();
  console.log(userData);
  const { userPosts } = useUserContext();
  if (session.status === "unauthenticated") {
    redirect("/");
  }
  const { fetchNextHomePage, getUniqueUserData } = useUserContext();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextHomePage();
    }
  }, [inView, fetchNextHomePage]);

  useEffect(() => {
    const getData = async (userId: string) => {
      const userData = await getUniqueUserData(userId);
      setUserData(userData);
    };

    getData(session.data?.userId);
  }, [session.data?.userId, getUniqueUserData]);

  if (!user || !userData) {
    return (
      <div className="w-full h-screen flex items-center justifty-center ">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full h-full mt-4 md:mt-10 px-2 flex flex-col ">
      <NextNProgress color="#FFFFFF" />

      <section className="w-full ">
        <div className="relative">
          <div className="flex flex-col">
            <Image
              src={
                session.data?.userBackground ||
                "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="bg image"
              width={1000}
              height={200}
              quality={50}
              priority
              className="h-[150px] w-[1100px] rounded-lg object-cover"
            />
          </div>
          <div className=" flex flex-col ">
            {user.image && (
              <Image
                src={user.image}
                alt="bg image"
                width={100}
                height={100}
                quality={100}
                priority
                className="max-size-28 rounded-lg absolute top-24 left-4"
              />
            )}
            <div className="flex flex-row justify-between items-center mt-2">
              <p className="ml-32 font-bold">{user?.name}</p>
              <span className="cursor-pointer ">
                <ProfileEditDialog userId={session.data?.userId} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
        <span className="flex flex-row items-center gap-1">
          {userData?.follower.length} Following
        </span>
        <span className="flex flex-row items-center gap-1">
          {userData?.followed.length} Followed
        </span>
      </section>

      <section>
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
      </section>
    </main>
  );
}
export default Page;
