"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import Logo from "./logo";
import { DotsHorizontalIcon, ExitIcon } from "@radix-ui/react-icons";
import AddPostDialog from "./add-post-dialog";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/types";
import { Skeleton } from "./ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/actions";

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
  if (!user) {
    return "";
  }

  return (
    <div className="sticky top-4 flex flex-col min-h-screen">
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
      {user ? (
        <div className="flex items-center justify-center gap-2 my-4">
          <Image
            src={user?.image}
            width={30}
            height={30}
            alt="user image"
            className="rounded-full w-6 h-6"
          />
          <div>
            <p className="mt-auto text-xs font-bold">@{user?.name}</p>
          </div>
          <p>
            <Popover>
              <PopoverTrigger asChild>
                <DotsHorizontalIcon className="cursor-pointer text-white/50 hover:text-white" />
              </PopoverTrigger>
              <PopoverContent className="w-[110px] h-auto">
                <div className="flex flex-row items-center justify-center gap-2 text-sm">
                  <Button onClick={logOut}>
                    {" "}
                    log out <ExitIcon scale={10} />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {/* <DotsHorizontalIcon /> */}
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
