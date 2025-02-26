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
} from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import {
  CommentsType,
  DataType,
  GetUniqueUserDataType,
  PagesType,
  PostType,
  UserFollowerIdsFn,
} from "@/types/types";
import { Post } from "@prisma/client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { createContext, useContext, useEffect, useState } from "react";

type ContextTypes = {
  addPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string | undefined
  ) => void;
  addCommentToPostToDB: (
    postText: string,
    fileType: string,
    mediaUrl: string,
    postId: string
  ) => void;
  getComments: (postId: string) => Promise<CommentsType[]>;
  data: DataType | undefined;
  userPosts: PagesType[] | undefined;
  likePostDB: (post: PostType) => void;
  refetch: () => void;
  fetchNextPage: () => void;
  fetchNextHomePage: () => void;
  error: Error | null;
  getUniqueUserData: (
    userId: string | string[] | undefined
  ) => Promise<GetUniqueUserDataType | undefined>;
  updateUserBackgroundImg: (
    bgUrl: string,
    bgSize: number,
    bgType: string,
    userId: string
  ) => void;
  getUserFollowersIds: (
    userId: string
  ) => Promise<UserFollowerIdsFn | undefined>;
  getPostByPostId: (postId: string) => Promise<PostType | undefined>;
};

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();

  /// /HOME POSTS
  const {
    data,
    error,
    fetchNextPage: fetchNextHomePage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
  useEffect(() => {
    console.log(data);
    setPostData(data);
  }, [data]);

  /// MAIN POSTS STATE
  const [postData, setPostData] = useState<
    InfiniteData<DataType, unknown> | undefined
  >(data);

  /// CURRENT LOGGED IN USER POSTS

  /// change to its own function
  const userPosts = postData?.pages?.map((posts: PagesType) => ({
    ...posts,
    posts: posts?.posts.filter(
      (post: PostType) => post.userId === session.data?.userId
    ),
  }));
  console.log(userPosts);

  /// UNIQUE USER POSTS
  async function getUniqueUserData(userId: string | string[] | undefined) {
    if (!userId) {
      return {
        message: "No user id provided!",
      };
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

      setPostData((prev) => ({
        ...prev,
        pages: prev?.pages.map((page, index) =>
          index === pageIndex
            ? {
                ...page,
                posts: page.posts.map((p: PostType, i: number) =>
                  i === postIndex
                    ? {
                        ...p,
                        likes: postLikes.likes,
                        LikeUsers: postLikes.LikeUsers,
                      }
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
    mediaUrl?: string | undefined,
    fileType?: string
  ) {
    const text = postText.replace(/\n/g, "\n");
    try {
      const post = await createPost(text, fileType, mediaUrl);

      // queryClient.invalidateQueries({ queryKey: ["posts"] });
      // refetch();
      // const newPost = await getPostById(post.postId);
      const newOptimisticPost = {
        ...post,
        User: {
          userId: session.data?.userId,
          image: session?.data?.user?.image,
          name: session?.data?.user?.name,
        },
      };

      setPostData((prev) => ({
        ...prev,
        pages: prev.pages.with(0, {
          ...prev.pages[0],
          posts: [newOptimisticPost, ...prev.pages[0].posts],
        }),
      }));
    } catch {}
  }

  // function setOptimisticNewPost(newPost) {
  //   setPostData((prev) => ({
  //     ...prev,
  //     pages: prev.pages.with(0, {
  //       ...prev.pages[0],
  //       posts: [newPost, ...prev.pages[0].posts],
  //     }),
  //   }));
  // }

  async function addCommentToPostToDB(
    commentText: string,
    postId: string,
    mediaUrl?: string | undefined,
    fileType?: string | undefined
  ) {
    const text = commentText.replace(/\n/g, "\n");
    await createCommentToPost(text, mediaUrl, fileType, postId);
  }

  async function getComments(postId: string) {
    /// post validation toast etc.

    const posts = await getPostComments(postId);

    return posts;
  }

  async function getPostByPostId(postId: string) {
    if (!postId) return;
    return getPostById(postId);
  }

  async function updateUserBackgroundImg(
    bgUrl: string,
    bgSize: number,
    bgType: string,
    userId: string
  ) {
    const message = await updateUserBackgroundImage(
      bgUrl,
      bgSize,
      bgType,
      userId
    );
    console.log(message);
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
        userPosts,
        getUniqueUserData,
        refetch,
        fetchNextHomePage,
        getUserFollowersIds,
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
