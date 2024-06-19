import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFetch from "@/hooks/useFetch";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const api = useFetch();

  const createTodoItem = async (todo: string) => {
    try {
      await api.post("/todos", { todo: todo, completed: false });
    } catch (err) {
      console.error("fetch error: ", err);
    }
  };

  return useMutation({
    mutationFn: async (todo: string) => await createTodoItem(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
