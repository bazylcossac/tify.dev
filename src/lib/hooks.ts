import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "./utils";

export function useInfinityScrollFetch() {
  console.log("fetchind posts!!");
  const { data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    // refetchInterval: 1000,
    initialPageParam: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return { data, error, fetchNextPage };
}
