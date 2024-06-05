import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTodoItem } from "@/utils/todo";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: string) => await createTodoItem(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
