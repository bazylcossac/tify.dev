"use client";

import Loading from "@/components/loading";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoIosPeople, IoMdMail } from "react-icons/io";

import UsersPosts from "@/components/users-posts-profile";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "@/contexts/userContextProvider";
import NextNProgress from "nextjs-progressbar";
import { followUser } from "@/actions/actions";

function Page() {
  const session = useSession();
  const [userFollowers, setUserFollowers] = useState();
  const { userPosts, getUserFollowersIds } = useUserContext();
  if (session.status === "unauthenticated") {
    redirect("/");
  }

  const user = session.data?.user;
  useEffect(() => {
    const getFollowers = async (userId: string) => {
      const followers = await getUserFollowersIds(userId);
      setUserFollowers(followers);
    };
    getFollowers(session.data?.userId);
  }, [getUserFollowersIds, session.data?.userId]);

  if (!user) {
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
              src="https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="bg image"
              width={1000}
              height={200}
              priority={true}
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
                priority={true}
                className="max-size-28 rounded-lg absolute top-24 left-4"
              />
            )}
            <div className="flex flex-row justify-between items-center mt-2">
              <p className="ml-32 font-bold">{user?.name}</p>
              {user.id !== userFollowers?.userId && (
                <Button className="px-6 rounded-lg bg-blue-600 hover:bg-[#0c0c0c]">
                  Follow
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
        <span className="flex flex-row items-center gap-1">
          {/* <IoIosPeople size={20} /> {userFollowers?.follower.length} */}
          {userFollowers?.follower.length} Following
        </span>
        <span className="flex flex-row items-center gap-1">
          {/* <IoIosPeople size={20} /> {userFollowers?.follower.length} */}
          {userFollowers?.followed.length} Followed
        </span>
        <Link href={`mailto::${user?.email}`}>
          <IoMdMail size={16} />
        </Link>
      </section>

      <section>
        <UsersPosts userPosts={userPosts} />
        {/* <UsersPosts /> */}
      </section>
    </main>
  );
}

export default Page;
