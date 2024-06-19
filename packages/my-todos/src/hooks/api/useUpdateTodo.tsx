import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const updateTodoItem = async ({ id, todo }: { id: number; todo: string }) => {
    try {
      await api.put(`/todos/${id}`, { todo: todo });
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

  return useMutation({
    mutationFn: async ({ id, todo }: { id: number; todo: string }) =>
      await updateTodoItem({ id, todo }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
