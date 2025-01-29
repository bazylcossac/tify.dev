import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "./utils";

export function useInfinityScrollFetch() {
  const { data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    // refetchInterval: 1000,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return { data, error, fetchNextPage };
}
