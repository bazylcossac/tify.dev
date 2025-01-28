import type { User } from "@prisma/client";
export type UserType = User;

export type MediaType = {
  createdAt: Date;
  id: string;
  postId: string;
  type: string;
  url: string;
};

export type PostType = {
  postId: string;
  postText: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: UserType;
  media: MediaType[];
};
