"use client";
import Loading from "@/components/loading";
import { useUserContext } from "@/contexts/userContextProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdMail } from "react-icons/io";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UsersPosts from "@/components/users-posts-profile";
import { followUser } from "@/actions/actions";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

function Page() {
  const params = useParams();
  const session = useSession();
  const { getUniqueUserData } = useUserContext();
  const [userPosts, setUserPosts] = useState();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getData = async (userId: string) => {
      const { userData, userPosts } = await getUniqueUserData(userId);

      setUserData(userData);
      setUserPosts(userPosts);
    };
    getData(params.user);
  }, [getUniqueUserData, params.user]);

  if (!userPosts || !userData) {
    return <Loading />;
  }
  const userIsFollowing = !!userData.followed.find(
    (follow) => follow.followerId === session.data?.userId
  );

  return (
    <main className="w-full h-full mt-4 md:mt-10 px-2 flex flex-col ">
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
            {userData.image && (
              <Image
                src={userData.image}
                alt="bg image"
                width={100}
                height={100}
                quality={100}
                priority={true}
                className="max-size-28 rounded-lg absolute top-24 left-4"
              />
            )}
            <div className="flex flex-row justify-between items-center mt-2">
              <p className="ml-32 font-bold">{userData?.name}</p>
              {session.data?.userId !== userData.id && (
                <Button
                  className={cn(
                    "px-6 rounded-lg bg-blue-600 hover:bg-[#0c0c0c]",
                    {
                      "bg-neutral-900": userIsFollowing,
                    }
                  )}
                  onClick={async () => followUser(userData.id)}
                >
                  {userIsFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
        <span className="flex flex-row items-center gap-1">
          {/* <IoIosPeople size={20} /> {userFollowers?.follower.length} */}
          {userData?.follower.length} Following
        </span>
        <span className="flex flex-row items-center gap-1">
          {/* <IoIosPeople size={20} /> {userFollowers?.follower.length} */}
          {userData?.followed.length} Followed
        </span>
        <Link href={`mailto::${userData?.email}`}>
          <IoMdMail size={16} />
        </Link>
      </section>

      <section>
        <UsersPosts userPosts={userPosts} />
      </section>
    </main>
  );
}

export default Page;
