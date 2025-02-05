import { Link2Icon } from "@radix-ui/react-icons";
import React, { useRef } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { Button } from "./ui/button";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { toast } from "sonner";

function FileInputComponent({ file, setFile, fileUrl, setFileUrl, showFile }) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  console.log(file);

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
    console.log(url);

    setFileUrl(url);
  }

  function openFileInput() {
    inputFileRef?.current?.click();
  }

  return (
    <>
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

      {showFile && fileUrl && file?.type.includes("video") ? (
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
      {showFile && fileUrl && file?.type.includes("image") ? (
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
      {!showFile && file && (
        <p className="text-xs text-white/70 max-w-[150px] truncate ">
          {file?.name}
        </p>
      )}
      {file && (
        <Button
          onClick={() => {
            setFile(undefined);
            setFileUrl(undefined);
          }}
          className="bg-red-500 mt-2 text-xs font-semibold w-[100px]"
        >
          Remove media
        </Button>
      )}
    </>
  );
}
export default FileInputComponent;
