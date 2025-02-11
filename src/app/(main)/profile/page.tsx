import { auth } from "@/auth";
import Loading from "@/components/loading";
import { prisma } from "@/lib/db";
import React from "react";

async function Page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    include: {
      posts: {
        include: {
          comments: true,
          media: true,
          LikeUsers: true,
        },
      },
    },
  });
  if (!user) {
    return <Loading />;
  }
  console.log(user);
  return <main className="bg-red-300 w-full h-full"></main>;
}

export default Page;
