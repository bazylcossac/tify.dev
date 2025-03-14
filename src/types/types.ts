import type { User } from "@prisma/client";
import {
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

export type UserType = User;

export type MediaType = {
  createdAt: Date;
  id: string;
  postId: string;
  type: string;
  url: string;
};

export type CommentsType = {
  commentId: string;
  commentText: string;
  commentMediaType: string;
  commentMediaUrl: string;
  postId: string;
  userId: string;
  userEmail: string;
  userImage: string;
  userName: string;
  createdAt: Date;
};

export type PostType = {
  LikeUsers: LikeUserType[];
  User: UserType;
  createdAt: Date;
  likes: number;
  media: MediaType[];
  postId: string;
  postText: string;
  stars: number;
  updatedAt: Date;
  userId: string;
  comments?: CommentsType[];
};

export type PagesType = {
  posts: PostType[];
  nextCursor: number;
};
export type DataType = {
  pageParams: number[];
  pages: PagesType[];
};

export type LikeUserType = {
  id: string;
  likedPostId: string | null;
  likedPostUserId: string;
};

export type userFollowersType = UserType & {
  followed: Follow[];
  follower: Follow[];
};

export type Follow = {
  id: string;
  followerId: string;
  followedId: string;
};
/// COMPONENT TYPES
export type FileInputT = {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  fileUrl: string | undefined;
  setFileUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  showFile: boolean;
  usage?: string;
};

/// FUNCTION TYPES

export type UserFollowerIdsFn = {
  follower: { id: string; followerId: string; followedId: string }[];
  followed: { id: string; followerId: string; followedId: string }[];
} & {
  name: string;
  id: string;
  username: string;
  backgroundImage: string;
  email: string;
  image: string;
};

export type GetUniqueUserDataType = {
  id: string;
  follower: { id: string; followerId: string; followedId: string }[];
  followed: { id: string; followerId: string; followedId: string }[];
  image: string;
  name: string;
  backgroundImage: string | null;
  email: string;
  premium: boolean;
};

export type GetCommentsType = {
  postId: string;
  userId: string;
  createdAt: Date;
  commentId: string;
  commentText: string;
  commentMediaUrl: string;
  commentMediaType: string;
  userName: string;
  userEmail: string;
  userImage: string;
}[];

export type messageType = {
  userId: string;
  userName: string;
  userImage: string;
  userPremium: boolean;
  message: string;
  createdAt: number;
  color?: string;
};

export type InputUserFollowsData = {
  id: string;
  followedId: string;
  followerId: string;
};

export type UserFollowsDataOutput = {
  id: string;
  name: string;
  email: string;
  image: string;
  backgroundImage: string;
  premium: boolean;
};

// USERCONTEXT TYPES

export type ContextTypes = {
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
