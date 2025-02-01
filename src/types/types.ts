import type { User } from "@prisma/client";
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
  User: UserType;
  media: MediaType[];
  LikeUsers: string[];
  comments: CommentsType[];
};
