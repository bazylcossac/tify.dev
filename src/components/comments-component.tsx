"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/contexts/userContextProvider";
import { computeSHA265, timeMessage } from "@/lib/utils";
import { CommentsType, PostType } from "@/types/types";
import Link from "next/link";
import FileInputComponent from "./file-input-component";
import { createCommentToPost, getSignedURL } from "@/actions/actions";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import Loading from "./loading";

function CommentsClient({ post }: { post: PostType }) {
  const { getComments } = useUserContext();
  const [comments, setCommnets] = useState<CommentsType[] | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState("");
  const [commentText, setCommentText] = useState("");

  const session = useSession();
  console.log(comments);
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
    setFileUrl("");

    setCommentText("");
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
  useEffect(() => {
    async function fetchComments() {
      const comments = await getComments(post.postId);
      setCommnets(comments);
    }
    fetchComments();
  }, [post, getComments]);

  if (!comments) {
    return <Loading />;
  }

  if (!session?.data?.user) {
    redirect("/");
  }
  return (
    <>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden w-full mt-10 ">
        {!comments?.length && (
          <div className="w-full h-full flex items-center justify-center font-light text-white/40">
            No comments...
          </div>
        )}
        {comments?.map((comment) => (
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
                  width={400}
                  quality={100}
                  height={560}
                  alt="user image"
                  className="rounded-lg "
                />
              ) : comment.commentMediaType.includes("video") ? (
                <video
                  src={comment.commentMediaType}
                  height={100}
                  controls
                  className="rounded-lg "
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

      <div className="mt-auto pt-2">
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
              className="transition font-semibold resize-none h-[30px] max-w-[300px] placeholder:text-white/50 mb-2 overflow-hidden "
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
    </>
  );
}

export default CommentsClient;
