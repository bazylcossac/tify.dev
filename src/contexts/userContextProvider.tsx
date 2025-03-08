"use client";

import {
  createCommentToPost,
  createPost,
  getPostLikesById,
  getPostComments,
  getUserById,
  getUserFollowers,
  likePost,
  updateUserBackgroundImage,
  getPostById,
  getUserFollows,
  getNLastMessagesFromDB,
} from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import {
  CommentsType,
  GetUniqueUserDataType,
  InputUserFollowsData,
  messageType,
  PagesType,
  PostType,
  UserFollowerIdsFn,
  UserFollowsDataOutput,
} from "@/types/types";

import {
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ContextTypes = {
  addPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string | undefined
  ) => Promise<{ message: string }>;
  addCommentToPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string,
    postId: string
  ) => void;
  getComments: (postId: string) => Promise<CommentsType[]>;
  data: InfiniteData<PagesType, unknown> | undefined;
  userPosts: PagesType[] | undefined;
  likePostDB: (post: PostType) => void;
  refetch: () => void;
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;

  error: Error | null;
  getUniqueUserData: (
    userId: string | string[] | undefined
  ) => Promise<GetUniqueUserDataType | undefined | null>;
  updateUserBackgroundImg: (
    bgUrl: string,
    bgSize: number,
    bgType: string,
    userId: string
  ) => void;
  getUserFollowersIds: (
    userId: string
  ) => Promise<UserFollowerIdsFn | undefined | null>;
  getPostByPostId: (postId: string) => Promise<PostType | undefined>;
  getUserFollowsData: (
    userIds: InputUserFollowsData[],
    type: "follower" | "followed"
  ) => Promise<UserFollowsDataOutput[]>;
  getNMessages: (n: number) => Promise<Omit<messageType, "color">[]>;
  setPostData: React.Dispatch<
    React.SetStateAction<InfiniteData<PagesType, unknown> | undefined>
  >;
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

  /// MAIN POSTS STATE
  const [postData, setPostData] = useState<
    InfiniteData<PagesType, unknown> | undefined
  >(data);

  /// CURRENT LOGGED IN USER POSTS

  /// change to its own function
  const userPosts = useMemo(() => {
    return postData?.pages?.map((posts: PagesType) => ({
      ...posts,
      posts: posts?.posts.filter(
        (post: PostType) => post.userId === session.data?.userId
      ),
    }));
  }, [postData, session.data?.userId]);

  /// UNIQUE USER POSTS
  async function getUniqueUserData(userId: string | string[] | undefined) {
    if (!userId) {
      return null;
    }
    const userData = await getUserById(userId);

    return userData;
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

    if (pageIndex === -1 || !pageIndex) {
      return;
    } else {
      const postIndex = postData?.pages[pageIndex].posts.findIndex(
        (p: PostType) => p.postId === currentPost?.postId
      );

      setPostData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page, index) =>
            index === pageIndex
              ? {
                  ...page,
                  posts: page.posts.map((p: PostType, i: number) =>
                    i === postIndex
                      ? {
                          ...p,
                          likes: postLikes!.likes,
                          LikeUsers: postLikes!.LikeUsers.map((user) => ({
                            ...user,
                            likedPostId: user.likedPostId || "",
                          })),
                        }
                      : p
                  ),
                }
              : page
          ),
        } as InfiniteData<PagesType, unknown>;
      });
    }
  }

  async function addPostToDB(
    postText: string,
    mediaUrl?: string | undefined,
    fileType?: string
  ) {
    const text = postText.replace(/\n/g, "\n");

    const message = await createPost(text, fileType, mediaUrl);
    refetch();
    return message;
  }

  async function addCommentToPostToDB(
    commentText: string,
    postId: string,
    mediaUrl?: string | undefined,
    fileType?: string | undefined
  ) {
    const text = commentText.replace(/\n/g, "\n");
    await createCommentToPost(text, postId, mediaUrl, fileType);
  }

  async function getComments(postId: string) {
    /// post validation toast etc.

    const comments = await getPostComments(postId);
    return comments;
  }

  async function getPostByPostId(postId: string) {
    if (!postId) return;
    const post = await getPostById(postId);
    return post ?? undefined;
  }

  async function updateUserBackgroundImg(
    bgUrl: string,
    bgSize: number,
    bgType: string,
    userId: string
  ) {
    await updateUserBackgroundImage(bgUrl, bgSize, bgType, userId);
  }

  async function getUserFollowsData(
    userIds: { id: string; followerId: string; followedId: string }[],
    type: "followed" | "follower"
  ) {
    const ids = userIds.map((id) =>
      type === "follower" ? id.followedId : id.followerId
    );

    return await getUserFollows(ids);
  }

  async function getNMessages(n: number) {
    const messages = await getNLastMessagesFromDB(n);
    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.getTime(),
    }));
  }

  return (
    <UserContext.Provider
      value={{
        addPostToDB,
        addCommentToPostToDB,
        setPostData,
        getComments,
        likePostDB,
        getPostByPostId,
        data: postData,
        getNMessages,
        userPosts,
        getUniqueUserData,
        refetch,
        fetchNextPage,
        getUserFollowersIds,
        getUserFollowsData,
        updateUserBackgroundImg,
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
