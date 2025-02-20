"use client";
import Loading from "@/components/loading";
import { useUserContext } from "@/contexts/userContextProvider";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import UsersPosts from "@/components/users-posts-profile";

import { useSession } from "next-auth/react";
import { GetUniqueUserDataType } from "@/types/types";

import UserStats from "@/components/user-profile-stats";
import UserProfileMain from "@/components/user-profile-main";

function Page() {
  const params = useParams();
  const session = useSession();
  const { getUniqueUserData } = useUserContext();

  const [userData, setUserData] = useState<GetUniqueUserDataType>();
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(
    !!userData?.followed.find(
      (follow) => follow.followerId === session.data?.userId
    )
  );
  console.log(userData);
  useEffect(() => {
    const getData = async (userId: string) => {
      console.log("fetchibg");
      const user = await getUniqueUserData(userId);
      setUserData(user);
      const userIsFollowing = !!user.followed.find(
        (follow) => follow.followerId === session.data?.userId
      );
      setIsFollowing(userIsFollowing);
    };

    getData(params.user);
  }, [getUniqueUserData, params.user, session.data?.userId]);

  if (!userData) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full h-full mt-4 md:mt-10 px-2 flex flex-col ">
      <section className="w-full ">
        <div className="relative">
          <UserProfileMain
            userData={userData}
            setUserData={setUserData}
            isFollowing={isFollowing}
            setIsFollowing={setIsFollowing}
          />
        </div>
      </section>
      <section className="mt-6 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
        <UserStats
          userFollowed={userData.followed.length || 0}
          userFollower={userData.follower.length || 0}
          email={userData.email}
        />
      </section>

      <section>
        <UsersPosts userId={params.user} />
      </section>
    </main>
  );
}

export default Page;
