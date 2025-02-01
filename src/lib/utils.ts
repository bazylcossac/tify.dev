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
  console.log("fetching data");
  const response = await fetch(`/api/posts?pageParam=${pageParam}`, {
    cache: "no-store",
  });
  const data = await response.json();

  return data;
};

export async function getPosts({ pageParam }: { pageParam: number }) {
  console.log("IM WORKING");

  const pageSize = 10;
  const posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageParam * pageSize,
    include: {
      media: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(posts);

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
