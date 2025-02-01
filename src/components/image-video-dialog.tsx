import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import React from "react";

function ImageAndVideoDialog({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "image" | "video";
}) {
  return (
    <>
      {children}
      {/* <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="z-10 absolute">{children}</DialogContent>
      </Dialog> */}
    </>
  );
}

export default ImageAndVideoDialog;
