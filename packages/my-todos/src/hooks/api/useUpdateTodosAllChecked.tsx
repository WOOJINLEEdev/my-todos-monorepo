import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTodosAllChecked } from "@/utils/todo";

export const useUpdateTodosAllChecked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checked: boolean) =>
      await updateTodosAllChecked(checked),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
