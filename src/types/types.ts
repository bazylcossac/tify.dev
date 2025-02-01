import type { User, Post } from "@prisma/client";
export type UserType = User;

export type MediaType = {
  createdAt: Date;
  id: string;
  postId: string;
  type: string;
  url: string;
};

export type CommentsType = {
  commentText: string;
};

export type PostType = {
  postId: string;
  postText: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  stars: number;
  userId: string;
  user: UserType;
  media: MediaType[];
  comments: CommentsType[];
};
