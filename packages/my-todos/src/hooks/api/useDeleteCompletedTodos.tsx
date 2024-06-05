import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCompletedTodos } from "@/utils/todo";

export const useDeleteCompletedTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await deleteCompletedTodos(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
