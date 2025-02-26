"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getSignedURL } from "@/actions/actions";
import { computeSHA265 } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/userContextProvider";
import { redirect } from "next/navigation";
import FileInputComponent from "./file-input-component";

import { IoMdAdd } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
function AddPostDialog() {
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addPostToDB, error } = useUserContext();

  const session = useSession();
  const queryClient = useQueryClient();
  if (!session?.data?.user) {
    redirect("/");
  }
  const user = session?.data?.user;
  if (!user) {
    return (
      <Skeleton className="w-[80px] h-[40px] bg-[#141414] animate-pulse rounded-lg" />
    );
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPostText(e.target.value);
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let checksum;
    let mediaUrl = "";
    try {
      if (file) {
        checksum = await computeSHA265(file);

        const { url } = await getSignedURL(file.type, file.size, checksum);

        if (!url) {
          toast("Failed to get url");
          throw new Error("Failed to get url");
        }
        mediaUrl = url?.split("?")[0];
        if (!mediaUrl) {
          toast("Failed to get media url");
          throw new Error("Failed to get media url");
        }

        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file?.type,
          },
        });
      }
      setLoading(true);
      addPostToDB(postText, mediaUrl, file?.type);
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (error) {
        toast(<p className="font-semibold">{error.message}</p>);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    setFile(undefined);
    setFileUrl(undefined);
    setPostText("");
    setDialogOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-bold md:rounded-xl bg-blue-600 text-xs md:px-10 md:mb-2 md:w-3/4 rounded-full size-12"
          onClick={() => setDialogOpen(true)}
        >
          <span className="hidden md:block">POST</span>
          <span className="md:hidden">
            <IoMdAdd fontSize={80} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 md:max-w-[425px] bg-[#0D0D0D] border-none">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <Image
              src={user.image!}
              alt="user-image"
              width={30}
              height={30}
              className="rounded-full "
            />
            <p className="font-bold text-sm">@{user?.name}</p>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 ">
            <Textarea
              className="transition font-semibold resize-none h-[70px] placeholder:text-white/50 mb-2 "
              placeholder="What's happening?"
              name="textarea"
              onChange={(e) => handleTextChange(e)}
              value={postText}
            />
          </div>

          <FileInputComponent
            file={file}
            setFile={setFile}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            showFile={true}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 mt-4"
              disabled={postText.trim().length === 0 && !file}
            >
              {loading ? "..." : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPostDialog;
