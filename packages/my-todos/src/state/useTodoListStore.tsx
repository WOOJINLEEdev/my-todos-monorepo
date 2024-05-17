import { create } from "zustand";

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

interface UseTodoListStoreProps {
  todoList: Todo[];
  remain: number;
  total: number;

  setTodoList: (todos: Todo[]) => void;
  setRemain: (count: number) => void;
  setTotal: (count: number) => void;
}

const useTodoListStore = create<UseTodoListStoreProps>()((set) => ({
  todoList: [],
  isOpen: false,
  remain: 0,
  total: 0,

  setTodoList: (todos) => {
    set((state) => ({
      ...state,
      todoList: todos,
    }));
  },
  setRemain: (count) => {
    set((state) => ({
      ...state,
      remain: count,
    }));
  },
  setTotal: (count) => {
    set((state) => ({
      ...state,
      total: count,
    }));
  },
}));

export default useTodoListStore;
