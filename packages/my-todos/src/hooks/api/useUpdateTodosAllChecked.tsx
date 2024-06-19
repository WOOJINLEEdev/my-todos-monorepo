import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useUpdateTodosAllChecked = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const updateTodosAllChecked = async (checked: boolean) => {
    try {
      await api.patch("/todos/completed", { completed: checked });
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

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
