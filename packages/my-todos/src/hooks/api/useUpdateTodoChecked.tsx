import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useUpdateTodoChecked = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const updateTodoItemChecked = async ({
    id,
    checked,
  }: {
    id: number;
    checked: boolean;
  }) => {
    try {
      await api.put(`/todos/${id}`, { completed: checked });
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

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
