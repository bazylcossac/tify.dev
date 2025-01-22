"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
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

function HomeSidebar() {
  const [postText, setPostText] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState("");
  const activePath = usePathname();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(e.target);
  }

  function onChange(e) {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    setFileType(file.type);
    if (file) {
      URL.revokeObjectURL(fileUrl);
    }
    const url = URL.createObjectURL(file);
    console.log(url);
    setFileUrl(url);
  }

  function openFileInput() {
    inputFileRef?.current?.click();
  }

  return (
    <div className="h-[700px] rounded-lg flex flex-col justify-between">
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
      <div className="mx-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-bold rounded-xl bg-blue-600 text-xs px-6 mb-2">
              POST
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0D0D0D] border-none">
            <DialogHeader>
              <DialogTitle>Make a post</DialogTitle>
              <DialogDescription>
                Tell others what's happening
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <Textarea
                  className="border-light border resize-none h-[70px] placeholder:text-white/50"
                  placeholder="What's happening?"
                  name="textarea"
                />
              </div>
              <Input
                type="file"
                name="fileInput"
                onChange={onChange}
                ref={inputFileRef}
                accept="image/*, video/*"
                className="bg-transparent flex-1 border-none outline-none hidden"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#292929"
                className="cursor-pointer w-8 mt-4"
                onClick={openFileInput}
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L12.5 6.06212"
                    stroke="#292929"
                    strokeWidth="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                  <path
                    d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373"
                    stroke="#292929"
                    strokeWidth="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                </g>
              </svg>
              {fileUrl && fileType.includes("vide") ? (
                <video
                  src={fileUrl}
                  className="h-[300px]"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                ""
              )}
              {fileUrl && fileType.includes("image") ? (
                <img src={fileUrl} alt="file" className="h-[300px]" />
              ) : (
                ""
              )}
              {file && (
                <Button
                  onClick={() => {
                    setFile(undefined);
                    setFileUrl(undefined);
                    setFileType("");
                  }}
                >
                  Remove
                </Button>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Post</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default HomeSidebar;
