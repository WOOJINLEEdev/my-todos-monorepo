import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTodoItem } from "@/utils/todo";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteTodoItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
