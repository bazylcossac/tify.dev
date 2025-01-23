"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import Logo from "./logo";

import AddPostDialog from "./add-post-dialog";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/types";

const routes = [
  {
    name: "Home",
    path: "/home",
  },
  {
    name: "Explore",
    path: "/explore",
  },
  {
    name: "Notifications",
    path: "/notifications",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];

function HomeSidebar() {
  const activePath = usePathname();
  const session = useSession();
  const user: UserType = session?.data?.user;
  if (!session) {
    return <p>Loading...</p>;
  }
  console.log(user?.image);
  return (
    <div className="sticky top-4 flex flex-col ">
      <div className="h-[800px] rounded-lg flex flex-col justify-between bg-[#0D0D0D]">
        <div>
          <ul className="p-4 space-y-4">
            <div className="p-2">
              <Logo />
            </div>
            {routes.map((route) => (
              <Link href={route.path} key={route.path}>
                <li
                  className={cn(
                    "p-2 text-white/60 rounded-lg font-bold  transition",
                    {
                      "text-bold text-white": activePath === route.path,
                    }
                  )}
                >
                  {route.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="mx-auto">
          <AddPostDialog />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        <Image
          src={user?.image}
          width={30}
          height={30}
          alt="user image"
          className="rounded-full w-8 h-8"
        />
        <div>
          <p className="mt-auto font-semibold">@{user?.name}</p>
          <p className="text-xs text-white/60">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default HomeSidebar;
