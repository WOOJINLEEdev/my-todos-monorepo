import { prisma } from "../lib/prisma";

export interface TodoField {
  todo?: string;
  completed?: boolean;
}

export const createTodo = async (todo: string, completed: boolean) => {
  const newTodo = await prisma.todolist.create({
    data: {
      todo: todo,
      completed: completed,
    },
  });

  return newTodo;
};

export const getAllTodos = async () => {
  const todolist = await prisma.todolist.findMany();
  return todolist;
};

export const getActiveTodos = async () => {
  const activeTodos = await prisma.todolist.findMany({
    where: {
      completed: false,
    },
  });

  return activeTodos;
};

export const getCompletedTodos = async () => {
  const completedTodos = await prisma.todolist.findMany({
    where: {
      completed: true,
    },
  });

  return completedTodos;
};

export const updateTodo = async (id: number, field: TodoField) => {
  await prisma.todolist.update({
    where: {
      id: id,
    },
    data: field,
  });
};

export const updateCompletedTodos = async (completed: boolean) => {
  await prisma.todolist.updateMany({
    data: {
      completed: completed,
    },
  });
};

export const deleteTodo = async (id: number) => {
  await prisma.todolist.delete({
    where: {
      id: id,
    },
  });
};

export const deleteCompletedTodos = async () => {
  await prisma.todolist.deleteMany({
    where: {
      completed: true,
    },
  });
};
