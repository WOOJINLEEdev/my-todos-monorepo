import { useInfiniteQuery } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const useGetTodos = ({ filter }: { filter: string }) => {
  const api = useFetch();
  const [token] = useLocalStorage<string | null>("token", null);

  const getTodos = async ({
    filter,
    offset = null,
    limit = 10,
  }: {
    filter: string;
    offset: number | null;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      filter: filter,
      limit: String(limit),
      offset: String(offset),
    });

    try {
      const res = await api.get(`/todos?${queryParams.toString()}`);
      return res;
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

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
      const res = await getTodos({
        filter: filter,
        offset: pageParam,
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.metadata.hasMore ? allPages.length * 10 : undefined;
    },
    enabled: !!token,
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
