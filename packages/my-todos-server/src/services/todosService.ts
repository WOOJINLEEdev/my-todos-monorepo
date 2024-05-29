import { Todo, todosModel } from "../models/todosModel";

export const todosService = {
  addTodoItem: async (todo: Todo) => {
    return await todosModel.createTodo(todo);
  },

  getTodos: async (filter: string) => {
    const { total, remain } = await todosModel.getTodoCount();

    switch (filter) {
      case "all":
        try {
          const todolist = await todosModel.getAllTodos();
          const modifiedTodolist = todolist?.map((todo) => ({
            id: todo.id,
            todo: todo.todo,
            completed: todo.completed === true,
            created_at: todo.created_at,
          }));

          return { todos: modifiedTodolist, remain: remain, total: total };
        } catch (err) {
          console.error("Todos 불러오는 중 오류 발생", err);
        }
        return;

      case "active":
        try {
          const activeTodolist = await todosModel.getActiveTodos();
          const modifiedActiveTodolist = activeTodolist?.map((todo) => ({
            id: todo.id,
            todo: todo.todo,
            completed: todo.completed === true,
            created_at: todo.created_at,
          }));

          return {
            todos: modifiedActiveTodolist,
            remain: remain,
            total: total,
          };
        } catch (err) {
          console.error("Active todo를 불러오는 중 오류 발생", err);
        }
        return;

      case "completed":
        try {
          const completedTodolist = await todosModel.getCompletedTodos();
          const modifiedCompletedTodolist = completedTodolist?.map((todo) => ({
            id: todo.id,
            todo: todo.todo,
            completed: todo.completed === true,
            created_at: todo.created_at,
          }));

          return {
            todos: modifiedCompletedTodolist,
            remain: remain,
            total: total,
          };
        } catch (err) {
          console.error("Completed todo를 불러오는 중 오류 발생", err);
        }
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
