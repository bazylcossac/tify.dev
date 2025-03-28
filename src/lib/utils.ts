import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const computeSHA265 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export async function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timeMessage(createdAt: Date) {
  let diff;
  let diffMessage;
  const postTime = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - postTime.getTime();
  diff = Math.floor(diffInMs / (1000 * 60)); /// minutes

  /// minutes
  if (diff < 60) {
    diffMessage = diff === 0 || diff === 1 ? "now" : `${diff} minutes ago`;
  } else if (diff > 60 && diff < 60 * 24) {
    /// hours
    diff = Math.floor(diffInMs / (1000 * 60) / 60);
    diffMessage = diff === 1 ? `${diff} hour ago` : `${diff} hours ago`;
  } else if (diff > 60 * 24) {
    /// days
    diff = Math.floor(diffInMs / (1000 * 60) / 60 / 24);

    diffMessage = diff === 1 ? `${diff} day ago` : `${diff} days ago`;
  } else if (diff > 60 * 24 * 30) {
    /// months
    diff = Math.floor(diffInMs / (1000 * 60) / 60 / 24 / 30);
    diffMessage = diff === 1 ? `${diff} month ago` : `${diff} months ago`;
  }

  return diffMessage;
}
export const fetchPosts = async (pageParam: number) => {
  const response = await fetch(`/api/posts?pageParam=${pageParam}`);
  const data = await response.json();

  return data;
};

export const fetchProfilePosts = async (
  pageParam: number,
  userId: string | string[]
) => {
  console.log(userId);
  const response = await fetch(
    `/api/profilePosts?pageParam=${pageParam}&userId=${userId}`,
    {}
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export async function getPosts({ pageParam }: { pageParam: number }) {
  const pageSize = 10;
  const posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageParam * pageSize,
    include: {
      media: true,
      User: true,
      LikeUsers: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPosts = await prisma.post.count();

  const hasMore = (pageParam + 1) * pageSize < totalPosts;

  return {
    posts,
    nextCursor: hasMore ? pageParam + 1 : null,
  };
}

export async function getUserPosts({
  pageParam,
  userId,
}: {
  pageParam: number;
  userId: string | string[] | undefined;
}) {
  if (!userId) {
    return;
  }
  let user;
  if (Array.isArray(userId)) {
    user = userId[0];
  } else {
    user = userId;
  }

  const pageSize = 10;
  const posts = await prisma.post.findMany({
    where: { userId: user },
    take: pageSize,
    skip: pageParam * pageSize,
    include: {
      media: true,
      User: true,
      LikeUsers: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPosts = await prisma.post.count();

  const hasMore = (pageParam + 1) * pageSize < totalPosts;

  return {
    posts,
    nextCursor: hasMore ? pageParam + 1 : null,
  };
}

/// FUNCTION TO TAKE ONLY #
// const posts = await prisma.post.findMany({
//   take: pageSize,
//   skip: pageParam * pageSize,
//   where: {
//     postText: {
//       contains: "#react",
//     },
//   },
//   include: {
//     media: true,
//     user: true,
//   },
//   orderBy: {
//     createdAt: "desc",
//   },
// });
