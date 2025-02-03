import { CommentsType, PostType } from "@/types/types";

import React, { useRef, useState } from "react";
import { IoChatbox } from "react-icons/io5";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Link2Icon } from "@radix-ui/react-icons";

function CommentDialog({ post }: { post: PostType }) {
  const [replyText, setReplyText] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const session = useSession();

  if (!session.data?.user) {
    redirect("/");
  }
  function openFileInput() {
    inputFileRef?.current?.click();
  }
  const formatText = (text: string) => {
    return text
      .split(/(#\S+|https?:\/\/www\.youtube\.com\/watch\S+)/g)
      .map((part, index) =>
        part.startsWith("#") ? (
          <Link href={`explore/${part.slice(1)}`} key={index}>
            <span className="text-blue-500 font-bold">{part}</span>
          </Link>
        ) : part.startsWith("https://www.youtube.com/watch") ? (
          <Link href={part} target="_blank" key={index}>
            <span className="text-blue-500 font-bold">{part}</span>
          </Link>
        ) : (
          part
        )
      );
  };
  return (
    <Dialog>
      <DialogTrigger>
        <IoChatbox className="text-neutral-600 text-sm cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0D0D0D] border-none">
        <DialogTitle></DialogTitle>
        <DialogHeader>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={post?.User?.image}
                width={30}
                height={30}
                alt="user image"
                className="rounded-full w-5 h-5"
              />
              <div className="flex flex-row items-center">
                <p className="mt-auto text-xs font-semibold ">
                  @{post?.User?.name}
                </p>
                <p className="text-[11px] text-white/30 mx-2">
                  {new Date(post?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs whitespace-pre-line">
            {formatText(post?.postText)}
          </p>
          <div className="flex flex-col text-white/30">
            <p className="-m-1">|</p>
            <p className="-m-1">|</p>
          </div>
        </DialogHeader>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={session.data.user.image}
              width={30}
              height={30}
              alt="user image"
              className="rounded-full w-5 h-5"
            />
            <div className="flex flex-row items-center">
              <p className="mt-auto text-xs font-semibold ">
                @{session.data.user.name}
              </p>
            </div>
          </div>
          <Input
            className="transition font-semibold placeholder:text-white/50  p-0 border-none"
            placeholder="Post your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>
        <DialogDescription></DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 "
              disabled={replyText.trim().length === 0}
            >
              Post
            </Button>
          </DialogClose>

          <>
            <Link2Icon onClick={openFileInput} className="cursor-pointer " />
            <p className="text-[8px] text-white/50 mt-1">MAX 10MB</p>
          </>

          <Input
            type="file"
            name="fileInput"
            ref={inputFileRef}
            accept="image/*, video/*"
            className="bg-transparent flex-1 border-none outline-none hidden "
          />
        </DialogFooter>
      </DialogContent>
      {/* <p className="text-xs font-light">{postComments.length || 0}</p> */}
    </Dialog>
  );
}

export default CommentDialog;
