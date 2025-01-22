import React, { useRef, useState } from "react";
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

function AddPostDialog() {
  const [postText, setPostText] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(fileUrl);
    console.log(postText);
    setFile(undefined);
    setFileUrl(undefined);
    setFileType("");
    setPostText("");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];

    setFile(file);
    setFileType(file?.type);
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
        <Button className="font-bold rounded-xl bg-blue-600 text-xs px-6 mb-2 ">
          POST
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0D0D0D] border-none">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <Image
              src="/images/noImage.jpg"
              alt="user-image"
              width={30}
              height={30}
              className="rounded-full "
            />
            <p className="font-bold">@dzekson</p>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 pt-4">
            <Textarea
              className="transition font-semibold resize-none h-[70px] placeholder:text-white/50 mb-2"
              placeholder="What's happening?"
              name="textarea"
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
            />
          </div>
          {!file && (
            <Link2Icon onClick={openFileInput} className="cursor-pointer " />
          )}
          <Input
            type="file"
            name="fileInput"
            onChange={onFileChange}
            ref={inputFileRef}
            accept="image/*, video/*"
            className="bg-transparent flex-1 border-none outline-none hidden "
          />

          {fileUrl && fileUrl && fileType.includes("vide") ? (
            <video
              src={fileUrl}
              className="h-[300px] rounded-xl"
              autoPlay
              loop
              muted
            />
          ) : (
            ""
          )}
          {fileUrl && fileUrl && fileType.includes("image") ? (
            <Image
              src={fileUrl}
              alt="file"
              className="h-[300px] rounded-xl"
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
                setFileType("");
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
                disabled={postText.trim().length === 0}
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
