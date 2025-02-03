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
import FileInputComponent from "./file-input-component";
import { computeSHA265 } from "@/lib/utils";
import { createCommentToPost, getSignedURL } from "@/actions/actions";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/userContextProvider";

function CommentDialog({ post }: { post: PostType }) {
  const [commentText, setCommentText] = useState("");
  const { addCommentToPostToDB } = useUserContext();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const session = useSession();

  if (!session.data?.user) {
    redirect("/");
  }
  console.log(post);
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let checksum;
    let mediaUrl: string | undefined;
    try {
      if (file) {
        checksum = await computeSHA265(file);
        const { url } = await getSignedURL(file.type, file.size, checksum);

        mediaUrl = url?.split("?")[0];
        if (!mediaUrl) {
          toast("Failed to get media url");
          throw new Error("Failed to get media url");
        }

        await fetch(url!, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file?.type,
          },
        });
      }

      const text = commentText.replace(/\n/g, "\n");

      await createCommentToPost(text, post.postId, mediaUrl, file?.type);
    } catch (err) {
      console.error(err);
    }

    setFile(undefined);
    setFileUrl(undefined);

    setCommentText("");
  }

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
          <p className="text-xs whitespace-pre-line ">
            {formatText(post?.postText)}
          </p>
          <div className="flex flex-col text-white/30">
            <p className="-m-1">|</p>
            <p className="-m-1">|</p>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Image
            src={session.data.user.image}
            width={30}
            height={30}
            alt="user image"
            className="rounded-full w-5 h-5 "
          />
          <div className="flex flex-row items-center">
            <p className="mt-auto text-xs font-semibold ">
              @{session.data.user.name}
            </p>
          </div>
        </div>
        <form className="-mt-2" onSubmit={onSubmit}>
          <div>
            <Input
              className="transition font-semibold placeholder:text-white/50 p-0 border-none"
              placeholder="Post your reply"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <FileInputComponent
              file={file}
              setFile={setFile}
              fileUrl={fileUrl}
              setFileUrl={setFileUrl}
            />
          </div>
          <DialogDescription></DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 "
                disabled={commentText.trim().length === 0}
              >
                Post
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>

      <p className="text-xs font-light">{post?.comments?.length || 0}</p>
    </Dialog>
  );
}

export default CommentDialog;
