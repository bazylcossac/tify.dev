"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

import Image from "next/image";

import { ExitIcon } from "@radix-ui/react-icons";
import { IoMdHome, IoIosPeople } from "react-icons/io";

import { IoSearchSharp, IoPersonSharp } from "react-icons/io5";

import { useSession } from "next-auth/react";

import { logOut } from "@/actions/actions";

import { Button } from "@/components/ui/button";

import { IoMdMenu } from "react-icons/io";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../logo";
import { Skeleton } from "../ui/skeleton";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const routes = [
  {
    name: "Home",
    path: "/home",
    icon: <IoMdHome />,
  },
  {
    name: "Premium",
    path: "/premium",
    icon: <MdOutlineWorkspacePremium />,
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

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const activePath = usePathname();
  const session = useSession();

  const user = session?.data?.user;
  if (!user) {
    return "";
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-none">
          <IoMdMenu />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#020202] border-none w-2/4 p-2" side="left">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col min-h-screen ">
          <div className="">
            <div>
              <ul className="space-y-4 ">
                <div className="p-4">
                  <Logo />
                </div>
                {routes.map((route) => (
                  <Link
                    href={route.path}
                    key={route.path}
                    onClick={() => setIsOpen(false)}
                  >
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
          </div>
          {user && user?.image ? (
            <div className="flex items-center justify-center gap-2 mt-auto mb-12">
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
                  className="text-white/30 hover:text-white p-0"
                >
                  {" "}
                  <ExitIcon />
                </Button>
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-4 my-auto pb-8">
              <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
