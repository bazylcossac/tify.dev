"use client";

import {
  createCommentToPost,
  createPost,
  getPostById,
  getPostComments,
} from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import { CommentsType, DataType } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

import { createContext, useContext, useEffect, useState } from "react";

type ContextTypes = {
  addPostToDB: (postText: string, fileType: string, mediaUrl: string) => void;
  addCommentToPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string,
    postId: string
  ) => void;
  getComments: (postId: string) => Promise<CommentsType[]>;
  data: DataType | undefined;
  refetch: () => void;
  fetchNextPage: () => void;
  error: Error | null;
};

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
  const [postData, setPostData] = useState(data || []);

  useEffect(() => {
    setPostData(data);
  }, [data]);

  async function addPostToDB(
    postText: string,
    mediaUrl?: string | undefined,
    fileType?: string | undefined
  ) {
    const text = postText.replace(/\n/g, "\n");
    const post = await createPost(text, fileType, mediaUrl);
    const newPost = await getPostById(post.postId);
    setPostData((prev) => ({
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === 0 ? { ...page, posts: [newPost, ...page.posts] } : page
      ),
    }));

    // refetch();
  }

  async function addCommentToPostToDB(
    commentText: string,
    postId: string,
    mediaUrl?: string | undefined,
    fileType?: string | undefined
  ) {
    const text = commentText.replace(/\n/g, "\n");
    await createCommentToPost(text, mediaUrl, fileType, postId);
    refetch();
  }

  async function getComments(postId: string) {
    /// post validation toast etc.
    console.log("get comments");
    console.log(postId);
    const posts = await getPostComments(postId);

    return posts;
  }
  return (
    <UserContext.Provider
      value={{
        addPostToDB,
        addCommentToPostToDB,
        setPostData,
        getComments,
        data: postData,
        refetch,
        fetchNextPage,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Please, use this hook in UserContextProvider");
  }
  return context;
}
