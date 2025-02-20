import Link from "next/link";
import React from "react";
import { IoMdMail } from "react-icons/io";

function UserStats({
  userFollower,
  userFollowed,
  email,
}: {
  userFollower: number;
  userFollowed: number;
  email: string;
}) {
  return (
    <>
      {" "}
      <span className="flex flex-row items-center gap-1">
        {userFollower} Following
      </span>
      <span className="flex flex-row items-center gap-1">
        {userFollowed} Followed
      </span>
      <Link href={`mailto::${email}`}>
        <IoMdMail size={16} />
      </Link>
    </>
  );
}

export default UserStats;
