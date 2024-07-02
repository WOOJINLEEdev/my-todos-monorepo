import { prisma } from "../lib/prisma";

export interface Todo {
  todo: string;
  completed: boolean;
}

export const todoModel = {
  createTodo: async ({
    todo,
    completed,
    userId,
  }: {
    todo: string;
    completed: boolean;
    userId: number;
  }) => {
    const newTodo = await prisma.todo.create({
      data: {
        todo: todo,
        completed: completed,
        user: {
          connect: { id: userId },
        },
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

  getAllTodos: async ({
    limit,
    offset,
    userId,
  }: {
    limit: string;
    offset: string;
    userId: number;
  }) => {
    return await prisma.todo.findMany({
      where: {
        userId: userId,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
    });
  },

  getActiveTodos: async ({
    limit,
    offset,
    userId,
  }: {
    limit: string;
    offset: string;
    userId: number;
  }) => {
    const activeTodos = await prisma.todo.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
      where: {
        userId: userId,
        completed: false,
      },
    });

    return activeTodos;
  },

  getCompletedTodos: async ({
    limit,
    offset,
    userId,
  }: {
    limit: string;
    offset: string;
    userId: number;
  }) => {
    const completedTodos = await prisma.todo.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        id: "asc",
      },
      where: {
        userId: userId,
        completed: true,
      },
    });

    return completedTodos;
  },

  updateTodo: async ({
    id,
    field,
    userId,
  }: {
    id: number;
    field: Partial<Todo>;
    userId: number;
  }) => {
    return await prisma.todo.updateMany({
      where: {
        userId: userId,
        id: id,
      },
      data: field,
    });
  },

  updateTodosToCompleted: async ({
    completed,
    userId,
  }: {
    completed: boolean;
    userId: number;
  }) => {
    return await prisma.todo.updateMany({
      where: {
        userId: userId,
      },
      data: {
        completed: completed,
      },
    });
  },

  deleteTodo: async ({ id, userId }: { id: number; userId: number }) => {
    return await prisma.todo.delete({
      where: {
        userId: userId,
        id: id,
      },
    });
  },

  deleteCompletedTodos: async (userId: number) => {
    return await prisma.todo.deleteMany({
      where: {
        userId: userId,
        completed: true,
      },
    });
  },
};
