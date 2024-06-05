import { Todo, todosModel } from "../models/todosModel";

export const todosService = {
  addTodoItem: async (todo: Todo) => {
    return await todosModel.createTodo(todo);
  },

  getTodos: async ({
    filter,
    limit,
    offset,
  }: {
    filter: string;
    limit: string;
    offset: string;
  }) => {
    const { total, activeCount, completedCount } =
      await todosModel.getTodoCount();

    switch (filter) {
      case "all":
        const todolist = await todosModel.getAllTodos(limit, offset);
        const modifiedTodolist = todolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.created_at,
        }));

        return {
          todos: modifiedTodolist,
          metadata: {
            remain: activeCount,
            total: total,
            hasMore: total > parseInt(offset) + todolist.length,
          },
        };

      case "active":
        const activeTodolist = await todosModel.getActiveTodos(limit, offset);
        const modifiedActiveTodolist = activeTodolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.created_at,
        }));

        return {
          todos: modifiedActiveTodolist,
          metadata: {
            remain: activeCount,
            total: total,
            hasMore: activeCount > parseInt(offset) + activeTodolist.length,
          },
        };

      case "completed":
        const completedTodolist = await todosModel.getCompletedTodos(
          limit,
          offset
        );
        const modifiedCompletedTodolist = completedTodolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.created_at,
        }));

        return {
          todos: modifiedCompletedTodolist,
          metadata: {
            remain: activeCount,
            total: total,
            hasMore:
              completedCount > parseInt(offset) + completedTodolist.length,
          },
        };
    }
  },
  updateTodoItem: async (id: number, field: Partial<Todo>) => {
    return await todosModel.updateTodo(id, field);
  },
  updateTodosToCompleted: async (completed: boolean) => {
    return await todosModel.updateTodosToCompleted(completed);
  },
  deleteTodoItem: async (id: number) => {
    return await todosModel.deleteTodo(id);
  },
  deleteCompletedTodos: async () => {
    return await todosModel.deleteCompletedTodos();
  },
};
