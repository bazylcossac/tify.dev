"use client";
import React, { useRef, useState, useTransition } from "react";
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
import { Button } from "./ui/button";
import { Link2Icon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { createPost, getSignedURL } from "@/actions/actions";
import { computeSHA265 } from "@/lib/utils";
import { UserType } from "@/types/types";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@/contexts/userContextProvider";
import { revalidateTag } from "next/cache";

function AddPostDialog() {
  const [postText, setPostText] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const { addPostToDB, error } = useUserContext();
  const queryClient = useQueryClient();

  const session = useSession();

  const user = session?.data?.user as UserType;
  if (!user) {
    return (
      <Skeleton className="w-[80px] h-[40px] bg-[#141414] animate-pulse rounded-lg" />
    );
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.startsWith("#")) {
    }
    setPostText(e.target.value);
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let checksum;
    let mediaUrl;
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
      console.log(mediaUrl);
      // const error = await createPost(postText, file?.type, mediaUrl);
      console.log(postText);
      addPostToDB(postText, file?.type, mediaUrl);


      console.log("POST ADDED");

      // queryClient.invalidateQueries({ queryKey: ["posts"] });

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
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    console.log(file);
    if (file.size > MAX_FILE_SIZE) {
      toast("File is too big!");
      setFile(undefined);
      return;
    }
    setFile(file);

    if (file && fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    const url = URL.createObjectURL(file);

    setFileUrl(url);
  }

  function openFileInput() {
    inputFileRef?.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl bg-blue-600 text-xs px-10 mb-2 w-3/4">
          POST
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0D0D0D] border-none">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <Image
              src={user?.image}
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
          {!file && (
            <>
              <Link2Icon onClick={openFileInput} className="cursor-pointer " />
              <p className="text-[8px] text-white/50 mt-1">MAX 10MB</p>
            </>
          )}

          <Input
            type="file"
            name="fileInput"
            onChange={onFileChange}
            ref={inputFileRef}
            accept="image/*, video/*"
            className="bg-transparent flex-1 border-none outline-none hidden "
          />

          {fileUrl && file?.type.includes("vide") ? (
            <video
              src={fileUrl}
              className="max-h-[300px] w-auto rounded-xl"
              autoPlay
              loop
              muted
            />
          ) : (
            ""
          )}
          {fileUrl && file?.type.includes("image") ? (
            <Image
              src={fileUrl}
              alt="file"
              className="max-h-[400px] w-auto  rounded-xl"
              height={300}
              width={300}
            />
          ) : (
            ""
          )}
          {file && (
            <Button
              onClick={() => {
                setFile(undefined);
                setFileUrl(undefined);
              }}
              className="bg-red-500 mt-2 text-xs font-semibold "
            >
              Remove
            </Button>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 "
                disabled={postText.trim().length === 0 && !file}
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

export default AddPostDialog;
