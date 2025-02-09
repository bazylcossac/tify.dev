"use client";

import {
  createCommentToPost,
  createPost,
  getPostById,
  getPostComments,
  likePost,
} from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import { CommentsType, DataType, PagesType, PostType } from "@/types/types";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { createContext, useContext, useEffect, useState } from "react";

type ContextTypes = {
  addPostToDB: (postText: string, fileType: string, mediaUrl: string) => void;
  addCommentToPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string,
    postId: string
  ) => void;
  getComments: (
    postId: string
  ) => Promise<Omit<CommentsType[], "post" | "user" | "media">>;
  data: DataType | undefined;
  likePostDB: (postId: string) => void;
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
  const [postData, setPostData] = useState<InfiniteData<PagesType> | undefined>(
    data! || []
  );

  useEffect(() => {
    setPostData(data);
  }, [data]);

  async function likePostDB(postId: string) {
    await likePost(postId);
    const post = await getPostById(postId);

    const pageIndex = postData?.pages.findIndex((page) =>
      page.posts.some((p: PostType) => p.postId === post?.postId)
    );
    // if (!pageIndex) {
    //   throw new Error("Failed to find infex");
    // }
    if (pageIndex === -1) {
      console.log("Post not found");
      return;
    } else {
      const postIndex = postData?.pages[pageIndex].posts.findIndex(
        (p: PostType) => p.postId === post?.postId
      );
      console.log({ pageIndex, postIndex });

      setPostData((prev) => ({
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === pageIndex
            ? {
                ...page,
                posts: page.posts.map((p, index) =>
                  index === postIndex ? post : p
                ),
              }
            : page
        ),
      }));
    }
  }

  async function addPostToDB(
    postText: string,
    mediaUrl?: string,
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
        likePostDB,
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
