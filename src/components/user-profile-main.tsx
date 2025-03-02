"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { followUser } from "@/actions/actions";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { GetUniqueUserDataType } from "@/types/types";
import Loading from "./loading";
import UserStats from "./user-profile-stats";

function UserProfileMain({ user }: { user: GetUniqueUserDataType }) {
  const session = useSession();
  const [userData, setUserData] = useState<GetUniqueUserDataType | undefined>(
    user
  );
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(
    !!userData?.followed.find(
      (follow) => follow.followerId === session.data?.userId
    )
  );
  useEffect(() => {
    if (!userData) return;

    const following = !!userData.followed.find(
      (follow) => follow.followerId === session.data?.userId
    );

    setIsFollowing(following);
  }, [userData, session.data?.userId]);

  if (!userData) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col">
        <Image
          src={
            userData.backgroundImage ||
            "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="bg image"
          width={1000}
          height={200}
          priority={true}
          className="h-[150px] w-full rounded-lg object-cover"
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
            className="max-size-28 rounded-lg absolute top-24 left-4 border-4 border-black"
          />
        )}
        <div className="flex flex-row justify-between items-center mt-2">
          <p className="ml-32 font-bold">{userData?.name}</p>
          {session.data?.userId !== userData.id && (
            <Button
              className={cn("px-6 rounded-lg bg-blue-600 hover:bg-[#0c0c0c]", {
                "bg-neutral-900": isFollowing,
              })}
              onClick={async () => {
                setIsFollowing((prev) => !prev);
                setUserData((prev) => {
                  if (!prev) return prev;

                  const updatedFollowed = isFollowing
                    ? prev.followed.filter(
                        (follow) => follow.followerId !== session.data?.userId
                      )
                    : [
                        ...prev.followed,
                        {
                          id: "noweId",
                          followerId: session.data?.userId || "",
                          followedId: prev.id,
                        },
                      ];

                  return { ...prev, followed: updatedFollowed };
                });
                followUser(userData.id);
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      <div>
        <section className="flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
          <UserStats user={userData} />
        </section>
      </div>
    </>
  );
}

export default UserProfileMain;
