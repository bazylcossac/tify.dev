"use client";

import {
  createCommentToPost,
  createPost,
  getPostLikesById,
  getPostComments,
  getUserById,
  getUserFollowers,
  likePost,
} from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import {
  DataType,
  GetCommentsType,
  GetUniqueUserData,
  PagesType,
  PostType,
  UserFollowerIdsFn,
} from "@/types/types";
import { Post } from "@prisma/client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { createContext, useContext, useEffect, useState } from "react";

type ContextTypes = {
  addPostToDB: (postText: string, fileType: string, mediaUrl: string) => void;
  addCommentToPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string,
    postId: string
  ) => void;
  getComments: (postId: string) => Promise<GetCommentsType>;
  data: DataType | undefined;
  userPosts: PagesType[] | undefined;
  likePostDB: (post: PostType) => void;
  refetch: () => void;
  fetchNextPage: () => void;
  error: Error | null;
  getUniqueUserData: (userId: string) => Promise<GetUniqueUserData | undefined>;
  getUserFollowersIds: (
    userId: string
  ) => Promise<UserFollowerIdsFn | undefined>;
};

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();

  /// /HOME POSTS
  const { data, error, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
  useEffect(() => {
    setPostData(data);
  }, [data]);

  const [postData, setPostData] = useState<
    InfiniteData<PagesType, unknown> | undefined
  >(data);
  console.log(postData);

  /// CURRENT LOGGED IN USER POSTS
  const userPosts = postData?.pages?.map((posts) => ({
    ...posts,
    posts: posts?.posts.filter(
      (post: PostType) => post.userId === session.data?.userId
    ),
  }));

  /// UNIQUE USER POSTS
  async function getUniqueUserData(userId: string) {
    const userData = await getUserById(userId);
    const userPosts = postData?.pages?.map((posts) => ({
      ...posts,
      posts: posts?.posts.filter((post: PostType) => post.userId === userId),
    }));
    return { userData, userPosts };
  }

  async function getUserFollowersIds(userId: string) {
    return await getUserFollowers(userId);
  }

  async function likePostDB(currentPost: PostType) {
    await likePost(currentPost.postId);
    const postLikes = await getPostLikesById(currentPost.postId);

    const pageIndex = postData?.pages.findIndex((page) =>
      page?.posts.some((p: PostType) => p.postId === currentPost?.postId)
    );

    if (pageIndex === -1) {
      return;
    } else {
      const postIndex = postData?.pages[pageIndex!].posts.findIndex(
        (p: PostType) => p.postId === currentPost?.postId
      );

      setPostData((prev) => ({
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === pageIndex
            ? {
                ...page,
                posts: page.posts.map((p: PostType, i: number) =>
                  i === postIndex
                    ? {
                        ...p,
                        likes: postLikes.likes,
                        LikeUsers: postLikes?.LikeUsers,
                      } // Aktualizacja tylko liczby lajków
                    : p
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
    fileType?: string
  ) {
    const text = postText.replace(/\n/g, "\n");
    const post = await createPost(text, fileType, mediaUrl);

    /// Optimistic setting post
    const newPost = await getPostById(post.postId);
    setPostData((prev) => ({
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === 0 ? { ...page, posts: [newPost, ...page.posts] } : page
      ),
    }));
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
        userPosts,
        getUniqueUserData,
        refetch,
        fetchNextPage,
        getUserFollowersIds,
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
