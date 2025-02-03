import type { Post, User } from "@prisma/client";
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
  postId: string;
  media: MediaType[];
  post: PostType;
  user: UserType;
  userId: string;
};

export type PostType = {
  LikeUsers: string[];
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
