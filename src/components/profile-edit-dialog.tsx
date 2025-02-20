"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { HiDotsHorizontal } from "react-icons/hi";
import { computeSHA265 } from "@/lib/utils";
import { getSignedURL } from "@/actions/actions";
import { toast } from "sonner";
import FileInputComponent from "./file-input-component";
import { Button } from "./ui/button";
import { useUserContext } from "@/contexts/userContextProvider";

function ProfileEditDialog({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { updateUserBackgroundImg } = useUserContext();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let checksum;
    let mediaUrl;
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

      updateUserBackgroundImg(mediaUrl, file?.size, file?.type, userId);
    } catch (err) {
      console.error(err);
    }

    setFile(undefined);
    setFileUrl(undefined);
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <HiDotsHorizontal />
      </DialogTrigger>
      <DialogContent className="w-4/5 md:max-w-[425px] bg-[#0D0D0D] border-none">
        <DialogTitle>Edit your profile</DialogTitle>
        <form onSubmit={onSubmit}>
          <FileInputComponent
            file={file}
            setFile={setFile}
            setFileUrl={setFileUrl}
            fileUrl={fileUrl}
            showFile
            usage="backgroundimage"
          />
          <DialogFooter>
            <Button
              type="submit"
              className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6 mt-4"
              disabled={!fileUrl}
            >
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileEditDialog;
