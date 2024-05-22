import {
  createTodo,
  getAllTodos,
  getActiveTodos,
  getCompletedTodos,
  updateTodo,
  updateCompletedTodos,
  deleteTodo,
  deleteCompletedTodos,
  TodoField,
} from "../models/todosModel";

export const addTodoItem = async (todo: string, completed: boolean) => {
  return await createTodo(todo, completed);
};

export const getTodolist = async () => {
  return await getAllTodos();
};

export const getActiveTodolist = async () => {
  return await getActiveTodos();
};

export const getCompletedTodolist = async () => {
  return await getCompletedTodos();
};

export const modifyTodoItem = async (id: number, field: TodoField) => {
  return await updateTodo(id, field);
};

export const modifyCompletedTodolist = async (completed: boolean) => {
  return await updateCompletedTodos(completed);
};

export const deleteTodoItem = async (id: number) => {
  return await deleteTodo(id);
};

export const deleteCompletedTodolist = async () => {
  return await deleteCompletedTodos();
};
