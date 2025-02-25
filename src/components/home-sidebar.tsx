"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

import Logo from "./logo";
import Image from "next/image";
import { ExitIcon } from "@radix-ui/react-icons";
import { IoMdHome, IoIosPeople } from "react-icons/io";
import { IoSearchSharp, IoPersonSharp } from "react-icons/io5";

import AddPostDialog from "./add-post-dialog";
import { useSession } from "next-auth/react";

import { Skeleton } from "./ui/skeleton";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/actions";

const routes = [
  {
    name: "Home",
    path: "/home",
    icon: <IoMdHome />,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: <IoSearchSharp />,
  },
  {
    name: "Friends",
    path: "/friends",
    icon: <IoIosPeople />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <IoPersonSharp />,
  },
];

function HomeSidebar() {
  const activePath = usePathname();
  const session = useSession();

  const user = session?.data?.user;
  if (!user) {
    return "";
  }

  return (
    <div className="sticky top-4 flex flex-col min-h-screen pl-5 md:max-w-[200px] ">
      <div className="max-h-[800px] rounded-lg flex flex-col justify-between ">
        <div>
          <ul className="p-4 space-y-4 ">
            <div className="p-4">
              <Logo />
            </div>
            {routes.map((route) => (
              <Link href={route.path} key={route.path}>
                <li
                  className={cn(
                    "p-4 text-white/60 text-md rounded-lg font-bold transition flex items-center gap-2",
                    {
                      "text-bold text-white":
                        `/${activePath?.slice(1).split("/")[0]}` ===
                        `/${route.path?.slice(1).split("/")[0]}`,
                    }
                  )}
                >
                  <p className="text-2xl">{route.icon}</p>
                  {route.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full flex items-center justify-center">
          <Suspense fallback={<div>loading...</div>}>
            <AddPostDialog />
          </Suspense>
        </div>
      </div>
      {user && user?.image ? (
        <div className="flex items-center justify-center gap-2 my-4 ">
          <Image
            src={user.image}
            width={10}
            height={10}
            quality={50}
            alt="user image"
            className="rounded-full size-6"
          />
          <div>
            <p className="mt-auto text-xs font-bold">@{user?.name}</p>
          </div>
          <p>
            {" "}
            <Button
              onClick={logOut}
              className="text-white/30 hover:text-white  p-0"
            >
              {" "}
              <ExitIcon />
            </Button>
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-4 my-4">
          <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeSidebar;

