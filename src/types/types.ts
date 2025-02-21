import type { User } from "@prisma/client";

/// DATA TYPES
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
  media: MediaType[];
  post: PostType;
  user: UserType;
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
  comments: CommentsType[];
};

export type PagesType = {
  posts: PostType[];
  nextCursor: number;
};
export type DataType = {
  pages: PagesType[];
  pageParams: number[];
};

export type LikeUserType = {
  id: string;
  likedPostId: string;
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
  email: string;
  image: string;
};

export type GetUniqueUserDataType = {
  id: string;
  follower: { id: string; followerId: string; followedId: string }[];
  followed: { id: string; followerId: string; followedId: string }[];
  image: string;
  name: string;
  backgroundImage: string;
  email: string;
  userData:
    | ({
        follower: { id: string; followerId: string; followedId: string }[];
        followed: { id: string; followerId: string; followedId: string }[];
      } & {
        name: string;
        id: string;
        username: string;
        backgroundImage: string;
        email: string;
        image: string;
      })
    | null;
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
