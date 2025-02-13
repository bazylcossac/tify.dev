import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { IoIosPeople, IoMdMail } from "react-icons/io";

async function ProfileStats() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const user = session.user;
  const postsCount = await prisma.post.count({
    where: { userId: session.userId },
  });
  console.log(postsCount);
  return (
    <>
      <span className="flex flex-row items-center gap-1">
        <IoIosPeople size={20} /> 216
      </span>
      <span className="flex flex-row items-center gap-1">
        {/* <FaNewspaper size={18} /> {user.posts.length || 0} */}
      </span>
      <Link href={`mailto::${user?.email}`}>
        <IoMdMail size={16} />
      </Link>
    </>
  );
}

export default ProfileStats;
