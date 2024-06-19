import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useDeleteCompletedTodos = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const deleteCompletedTodos = async () => {
    try {
      await api.delete("/todos/completed");
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

  return useMutation({
    mutationFn: async () => await deleteCompletedTodos(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
