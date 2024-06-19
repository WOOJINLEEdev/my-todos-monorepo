import { Todo, todosModel } from "../models/todosModel";

export const todosService = {
  addTodoItem: async ({
    todo,
    completed,
    userId,
  }: {
    todo: string;
    completed: boolean;
    userId: number;
  }) => {
    return await todosModel.createTodo({
      todo,
      completed,
      userId,
    });
  },

  getTodos: async ({
    filter,
    limit,
    offset,
    userId,
  }: {
    filter: string;
    limit: string;
    offset: string;
    userId: number;
  }) => {
    const { total, activeCount, completedCount } =
      await todosModel.getTodoCount();

    switch (filter) {
      case "all":
        const todolist = await todosModel.getAllTodos({
          limit,
          offset,
          userId,
        });
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
        const activeTodolist = await todosModel.getActiveTodos({
          limit,
          offset,
          userId,
        });
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
        const completedTodolist = await todosModel.getCompletedTodos({
          limit,
          offset,
          userId,
        });
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
  updateTodoItem: async ({
    id,
    field,
    userId,
  }: {
    id: number;
    field: Partial<Todo>;
    userId: number;
  }) => {
    return await todosModel.updateTodo({ id, field, userId });
  },
  updateTodosToCompleted: async ({
    completed,
    userId,
  }: {
    completed: boolean;
    userId: number;
  }) => {
    return await todosModel.updateTodosToCompleted({ completed, userId });
  },
  deleteTodoItem: async ({ id, userId }: { id: number; userId: number }) => {
    return await todosModel.deleteTodo({ id, userId });
  },
  deleteCompletedTodos: async (userId: number) => {
    return await todosModel.deleteCompletedTodos(userId);
  },
};
