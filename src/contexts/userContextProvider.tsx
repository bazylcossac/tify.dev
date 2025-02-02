"use client";

import { createPost } from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { revalidateTag } from "next/cache";

import {
  createContext,
  startTransition,
  useContext,
  useOptimistic,
  useTransition,
} from "react";

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  async function addPostToDB(
    postText: string,
    fileType: string,
    mediaUrl: string
  ) {
    const text = postText.replace(/\n/g, "\n");
    await createPost(text, fileType, mediaUrl);

    refetch();
  }

  return (
    <UserContext.Provider
      value={{
        addPostToDB,
        data,
        refetch,
        fetchNextPage,
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
