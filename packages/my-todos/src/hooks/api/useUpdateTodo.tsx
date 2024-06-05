import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTodoItem } from "@/utils/todo";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, todo }: { id: number; todo: string }) =>
      await updateTodoItem({ id: id, todo: todo }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
