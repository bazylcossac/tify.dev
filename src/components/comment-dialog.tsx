import { PostType } from "@/types/types";

import React, { useState } from "react";
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

import FileInputComponent from "./file-input-component";
import { computeSHA265 } from "@/lib/utils";
import { createCommentToPost, getSignedURL } from "@/actions/actions";
import { toast } from "sonner";
import formatText from "@/lib/formatText";

function CommentDialog({ post }: { post: PostType }) {
  const [commentText, setCommentText] = useState("");

  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const session = useSession();

  if (!session.data?.user) {
    redirect("/");
  }

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
        console.log(mediaUrl);
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
        <IoChatbox className="text-neutral-600 text-sm md:text-lg cursor-pointer" />
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
                className="rounded-full w-6 h-6"
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
          <div className="flex flex-col items-start">
            <p className="text-xs whitespace-pre-line-">
              {formatText(post?.postText)}
            </p>
            <div className="flex flex-col mt-2 text-white/30">
              <p className="-m-1">|</p>
              <p className="-m-1">|</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Image
            src={session.data.user.image!}
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
              showFile={true}
            />
          </div>
          <DialogDescription></DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 mt-4 md:mt-0"
                disabled={commentText.trim().length === 0}
              >
                Post
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
