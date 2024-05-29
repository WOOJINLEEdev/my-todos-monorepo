import { prisma } from "../lib/prisma";

export interface Todo {
  todo: string;
  completed: boolean;
}

export const todosModel = {
  createTodo: async (todo: Todo) => {
    const newTodo = await prisma.todo.create({
      data: {
        todo: todo.todo,
        completed: todo.completed,
      },
    });

    return newTodo;
  },

  getTodoCount: async () => {
    const todoCount = await prisma.todo.count();
    const activeCount = await prisma.todo.count({
      where: {
        completed: false,
      },
    });

    return { total: todoCount, remain: activeCount };
  },

  getAllTodos: async () => {
    return await prisma.todo.findMany();
  },

  getActiveTodos: async () => {
    const activeTodos = await prisma.todo.findMany({
      where: {
        completed: false,
      },
    });

    return activeTodos;
  },

  getCompletedTodos: async () => {
    const completedTodos = await prisma.todo.findMany({
      where: {
        completed: true,
      },
    });

    return completedTodos;
  },

  updateTodo: async (id: number, field: Partial<Todo>) => {
    return await prisma.todo.update({
      where: {
        id: id,
      },
      data: field,
    });
  },

  updateTodosToCompleted: async (completed: boolean) => {
    return await prisma.todo.updateMany({
      data: {
        completed: completed,
      },
    });
  },

  deleteTodo: async (id: number) => {
    return await prisma.todo.delete({
      where: {
        id: id,
      },
    });
  },

  deleteCompletedTodos: async () => {
    return await prisma.todo.deleteMany({
      where: {
        completed: true,
      },
    });
  },
};
