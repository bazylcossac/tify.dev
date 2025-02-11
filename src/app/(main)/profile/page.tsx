import { auth } from "@/auth";
import Loading from "@/components/loading";
import { prisma } from "@/lib/db";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  return (
    <main className="w-full h-screen mt-4 md:mt-10 px-2 flex flex-col ">
      <section className="w-full ">
        <div className="relative">
          <div className="flex flex-col">
            <Image
              src="https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="bg image"
              width={1000}
              height={200}
              className="h-[150px] w-[1100px] rounded-lg object-cover"
            />
          </div>
          <div className=" flex flex-col ">
            <Image
              src={user.image}
              alt="bg image"
              width={100}
              height={100}
              quality={100}
              className="max-size-28 rounded-lg absolute top-24 left-4"
            />
            <div className="flex flex-row justify-between items-center mt-2">
              <p className="ml-32 font-bold">{user.name}</p>
              <Button className="px-6 rounded-lg bg-blue-600 hover:bg-[#0c0c0c]">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-7 flex flex-row gap-4 text-white/60 font-semibold text-sm">
        <p>Friends: 216</p>
        <p>Posts: {user.posts.length || 0}</p>
        <p>Email</p>
      </section>

      <section></section>
    </main>
  );
}

export default Page;
