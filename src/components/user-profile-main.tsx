"use client";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { followUser } from "@/actions/actions";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { GetUniqueUserDataType } from "@/types/types";
import Loading from "./loading";

function UserProfileMain({
  userData,
  setUserData,
  isFollowing,
  setIsFollowing,
}: {
  userData: GetUniqueUserDataType;
  setUserData: React.Dispatch<
    React.SetStateAction<GetUniqueUserDataType | undefined>
  >;
  isFollowing: boolean | undefined;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
  const session = useSession();

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
                  return {
                    ...prev,
                    followed: isFollowing
                      ? prev.followed.slice(0, -1)
                      : [
                          ...prev.followed,
                          { id: "", followerId: "", followedId: "" },
                        ],
                  };
                });
                followUser(userData.id);
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfileMain;
