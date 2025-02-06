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

function CommentsClient({ post }: { post: PostType }) {
  const { getComments } = useUserContext();
  const [comments, setCommnets] = useState<CommentsType[] | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState("");
  const [commentText, setCommentText] = useState("");

  console.log(comments);

  const session = useSession();

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
    return (
      <div
        role="status"
        className=" w-full h-full flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-neutral-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!session?.data?.user) {
    redirect("/");
  }
  return (
    <>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden  w-full h-full mt-10">
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
            <div className="flex flex-row gap-2 items-center ">
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
                <p className="text-xs">{timeMessage(comment?.createdAt)}</p>
              </div>
            </div>
            <div className="mt-4 w-full">
              <p className=" font-semibold text-xs mb-2 w-[400px] break-words">
                {formatText(comment.commentText)}
              </p>
              {comment?.commentMediaType &&
              comment.commentMediaUrl.includes("image") ? (
                <Image
                  src={comment.commentMediaType}
                  width={600}
                  quality={100}
                  height={560}
                  alt="user image"
                  className="rounded-lg max-w-[450px]"
                />
              ) : comment.commentMediaUrl.includes("video") ? (
                <video
                  src={comment.commentMediaType}
                  height={100}
                  controls
                  className="rounded-lg max-w-[450px]"
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

      <div className=" flex flex-row items-center justify-between w-full mt-auto pt-2">
        <form
          className="flex flex-row items-center justify-between w-full"
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
              className="transition font-semibold resize-none h-[30px] w-[300px] placeholder:text-white/50 mb-2 overflow-hidden "
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
