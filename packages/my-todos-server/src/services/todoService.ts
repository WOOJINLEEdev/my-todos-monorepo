import { Todo, todoModel } from "../models/todoModel";

export const todoService = {
  addTodoItem: async ({
    todo,
    completed,
    userId,
  }: {
    todo: string;
    completed: boolean;
    userId: number;
  }) => {
    return await todoModel.createTodo({
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
      await todoModel.getTodoCount();

    switch (filter) {
      case "all":
        const todolist = await todoModel.getAllTodos({
          limit,
          offset,
          userId,
        });
        const modifiedTodolist = todolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.createdAt,
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
        const activeTodolist = await todoModel.getActiveTodos({
          limit,
          offset,
          userId,
        });
        const modifiedActiveTodolist = activeTodolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.createdAt,
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
        const completedTodolist = await todoModel.getCompletedTodos({
          limit,
          offset,
          userId,
        });
        const modifiedCompletedTodolist = completedTodolist?.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed === true,
          created_at: todo.createdAt,
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
    return await todoModel.updateTodo({ id, field, userId });
  },
  updateTodosToCompleted: async ({
    completed,
    userId,
  }: {
    completed: boolean;
    userId: number;
  }) => {
    return await todoModel.updateTodosToCompleted({ completed, userId });
  },
  deleteTodoItem: async ({ id, userId }: { id: number; userId: number }) => {
    return await todoModel.deleteTodo({ id, userId });
  },
  deleteCompletedTodos: async (userId: number) => {
    return await todoModel.deleteCompletedTodos(userId);
  },
};
