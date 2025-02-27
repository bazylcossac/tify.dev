"use client";

import Link from "next/link";
import React from "react";
import { IoMdMail } from "react-icons/io";
import { FollowersDialog } from "./followers-dialog";

function UserStats({ user }: { user: any }) {
  console.log(user);
  return (
    <section className="mt-4 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
      {" "}
      <FollowersDialog user={user} type="follower">
        <span className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-white transition">
          {user?.follower?.length} Following
        </span>
      </FollowersDialog>
      <FollowersDialog user={user} type="followed">
        <span className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-white transition">
          {user?.followed?.length} Followed
        </span>
      </FollowersDialog>
      <Link href={`mailto::${user?.email}`}>
        <IoMdMail size={16} />
      </Link>
    </section>
  );
}

export default UserStats;
