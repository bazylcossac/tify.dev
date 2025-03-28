import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "./utils";

export function useInfinityScrollFetch() {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async ({ pageParam = 1 }) => await fetchPosts(pageParam),

      initialPageParam: 0,
      staleTime: 0,
      gcTime: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    });

  return { data, error, fetchNextPage, hasNextPage, isFetchingNextPage };
}
