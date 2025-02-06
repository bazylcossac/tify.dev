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

/// COMPONENT TYPES
export type FileInputT = {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  fileUrl: string | undefined;
  setFileUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  showFile: boolean;
};
