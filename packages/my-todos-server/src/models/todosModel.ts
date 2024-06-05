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
    const completedCount = await prisma.todo.count({
      where: {
        completed: true,
      },
    });

    return {
      total: todoCount,
      activeCount: activeCount,
      completedCount: completedCount,
    };
  },

  getAllTodos: async (limit: string, offset: string) => {
    return await prisma.todo.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
    });
  },

  getActiveTodos: async (limit: string, offset: string) => {
    const activeTodos = await prisma.todo.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
      where: {
        completed: false,
      },
    });

    return activeTodos;
  },

  getCompletedTodos: async (limit: string, offset: string) => {
    const completedTodos = await prisma.todo.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
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
