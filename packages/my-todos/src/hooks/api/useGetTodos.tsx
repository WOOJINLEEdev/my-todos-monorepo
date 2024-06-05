import { useInfiniteQuery } from "@tanstack/react-query";

import { getTodos } from "@/utils/todo";

export const useGetTodos = ({ filter }: { filter: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["todos", filter],
    queryFn: async ({ pageParam }) => {
      const res = await getTodos({ filter: filter, offset: pageParam });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.metadata.hasMore ? allPages.length * 10 : undefined;
    },
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
    status,
    error,
  };
};
