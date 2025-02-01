"use client";

import { createPost } from "@/actions/actions";
import { fetchPosts } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";

import { createContext, useContext, useTransition } from "react";

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),
    // refetchInterval: 1000,
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  async function addPostToDB(
    postText: string,
    fileType: string,
    mediaUrl: string
  ) {
    await createPost(postText, fileType, mediaUrl);

    refetch();
  }

  return (
    <UserContext.Provider
      value={{ addPostToDB, data, refetch, fetchNextPage, error, isPending }}
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
