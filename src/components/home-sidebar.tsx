"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import Logo from "./logo";

import {
  ExitIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import AddPostDialog from "./add-post-dialog";
import { useSession } from "next-auth/react";

import { Skeleton } from "./ui/skeleton";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/actions";

const routes = [
  {
    name: "Home",
    path: "/home",
    icon: <HomeIcon />,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: <MagnifyingGlassIcon />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <BellIcon />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon />,
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
    <div className="sticky top-4 flex flex-col min-h-screen pl-2 ">
      <div className="max-h-[800px] rounded-lg flex flex-col justify-between ">
        <div>
          <ul className="p-4 space-y-4">
            <div className="p-2">
              <Logo />
            </div>
            {routes.map((route) => (
              <Link href={route.path} key={route.path}>
                <li
                  className={cn(
                    "p-2 text-white/60 text-md rounded-lg font-bold transition flex items-center gap-2",
                    {
                      "text-bold text-white":
                        `/${activePath?.slice(1).split("/")[0]}` ===
                        `/${route.path?.slice(1).split("/")[0]}`,
                    }
                  )}
                >
                  {route.icon}
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
      {user && user.image ? (
        <div className="flex items-center justify-center gap-2 my-4 ">
          <Image
            src={user.image}
            width={30}
            height={30}
            alt="user image"
            className="rounded-full w-6 h-6"
            priority={true}
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
