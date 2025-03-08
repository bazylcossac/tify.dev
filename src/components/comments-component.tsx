"use client";
import React, { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import { computeSHA265, timeMessage } from "@/lib/utils";

import FileInputComponent from "./file-input-component";
import { createCommentToPost, getSignedURL } from "@/actions/actions";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import Loading from "./loading";
import formatText from "@/lib/formatText";
import { useQuery } from "@tanstack/react-query";

function CommentsClient({ postId }: { postId: string }) {
  const session = useSession();
  if (!session?.data?.user) {
    redirect("/");
  }

  const { getComments } = useUserContext();

  const [file, setFile] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState<string | undefined>("");
  const [commentText, setCommentText] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`post-comments-${postId}`],
    queryFn: () => getComments(postId),
    staleTime: 0,
  });

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

      await createCommentToPost(text, postId, mediaUrl, file?.type);
    } catch (err) {
      console.error(err);
    }

    setFile(undefined);
    setFileUrl("");

    setCommentText("");
    refetch();
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        <p>Failed to fetch</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }
  return (
    <>
      <div className="mt-4 pt-2">
        <form
          className="flex flex-row items-center justify-between w-full "
          onSubmit={onSubmit}
        >
          <div className="flex flex-row items-center">
            <Image
              src={session.data.user.image || "./public/images/noImage.jpg"}
              width={26}
              height={26}
              quality={75}
              alt="user image"
              className="rounded-full my-auto"
            />

            <Textarea
              className="transition font-semibold resize-none h-[30px] max-w-[400px] placeholder:text-white/50 mb-2 overflow-hidden "
              placeholder="Post your reply..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <div>
            <Button
              className="active:bg-black focus:bg-black font-bold rounded-xl bg-blue-600 text-xs px-6"
              disabled={!commentText && !file}
            >
              Post
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-1">
        <FileInputComponent
          file={file}
          setFile={setFile}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          showFile={false}
        />
      </div>

      <div className="flex flex-col overflow-y-auto overflow-x-hidden w-full mt-10 ">
        {!data?.length && (
          <div className="w-full h-full flex items-center justify-center font-light text-white/40">
            No comments...
          </div>
        )}
        {data?.map((comment) => (
          <div
            key={comment.commentId}
            className="border-b border-white/30 pb-4 m-2"
          >
            <div className="flex flex-row gap-2 items-center">
              <Image
                src={comment.userImage}
                width={30}
                height={30}
                alt="user image"
                className="rounded-full w-6 h-6"
              />

              <div className="flex items-center">
                <p className="mt-auto text-sm font-semibold">
                  @{comment.userName}
                </p>
              </div>
              <div>
                <p className="md:text-[11px] text-[9px]">
                  {timeMessage(comment?.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 w-full">
              <p className=" font-semibold text-xs mb-2 max-w-[400px] break-words">
                {formatText(comment.commentText)}
              </p>
              {comment?.commentMediaType &&
              comment.commentMediaType.includes("image") ? (
                <Image
                  src={comment.commentMediaUrl}
                  quality={100}
                  width={1000}
                  height={1000}
                  alt="user image"
                  className="rounded-lg w-full "
                />
              ) : comment.commentMediaType.includes("video") ? (
                <video
                  src={comment.commentMediaUrl}
                  height={100}
                  controls
                  className="rounded-lg w-full max-h-[450px]"
                >
                  <source
                    src={comment.commentMediaType}
                    type={comment.commentMediaUrl}
                  />
                </video>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CommentsClient;
