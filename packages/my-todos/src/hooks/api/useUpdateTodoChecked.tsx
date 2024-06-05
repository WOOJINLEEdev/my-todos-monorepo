import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTodoItemChecked } from "@/utils/todo";

export const useUpdateTodoChecked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, checked }: { id: number; checked: boolean }) =>
      await await updateTodoItemChecked({
        id: id,
        checked: checked,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
