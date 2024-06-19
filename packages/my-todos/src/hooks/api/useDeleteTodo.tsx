import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const deleteTodoItem = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

  return useMutation({
    mutationFn: async (id: number) => await deleteTodoItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
