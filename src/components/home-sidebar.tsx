"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function HomeSidebar() {
  const activePath = usePathname();

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
  ];
  return (
    <div className="h-[700px] rounded-lg">
      <div>
        <ul className="p-4 space-y-4">
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
    </div>
  );
}

export default HomeSidebar;
