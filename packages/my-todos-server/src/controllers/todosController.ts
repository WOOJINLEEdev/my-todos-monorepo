import { Request, Response } from "express";

import {
  addTodoItem,
  deleteCompletedTodolist,
  deleteTodoItem,
  getActiveTodolist,
  getCompletedTodolist,
  getTodolist,
  modifyCompletedTodolist,
  modifyTodoItem,
} from "../services/todosService";
import { TodoField } from "../models/todosModel";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { todo, completed } = req.body;
    const newTodo = await addTodoItem(todo, completed);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("새로운 Todo 추가 중 오류 발생", err);
    res.status(500).send("새로운 Todo 추가 중 오류 발생");
  }
};

export const getTodosByFilter = async (req: Request, res: Response) => {
  const filter = req.query?.filter || "all";
  let remain;
  let total;

  try {
    const todolist = await getTodolist();
    const activeCount = todolist?.filter((result) => !result.completed).length;
    const totalCount = todolist?.length;

    remain = activeCount;
    total = totalCount;
  } catch (err) {
    console.error("Todolist 불러오는 중 오류 발생", err);
    res.status(500).send("Todolist 불러오는 중 오류 발생");
  }

  if (filter === "all") {
    try {
      const todolist = await getTodolist();
      const modifiedTodolist = todolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({ data: modifiedTodolist, remain: remain, total: total });
    } catch (err) {
      console.error("Todolist 불러오는 중 오류 발생", err);
      res.status(500).send("Todolist 불러오는 중 오류 발생");
    }
  }

  if (filter === "active") {
    try {
      const activeTodolist = await getActiveTodolist();
      const modifiedActiveTodolist = activeTodolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({
        data: modifiedActiveTodolist,
        remain: remain,
        total: total,
      });
    } catch (err) {
      console.error("Active todo를 불러오는 중 오류 발생", err);
      res.status(500).send("Active todo를 불러오는 중 오류 발생");
    }
  }

  if (filter === "completed") {
    try {
      const completedTodolist = await getCompletedTodolist();
      const modifiedCompletedTodolist = completedTodolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({
        data: modifiedCompletedTodolist,
        remain: remain,
        total: total,
      });
    } catch (err) {
      console.error("Completed todo를 불러오는 중 오류 발생", err);
      res.status(500).send("Completed todo를 불러오는 중 오류 발생");
    }
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const todoId = req.params.id;

  try {
    const { todo, completed }: { todo: string; completed: boolean } = req.body;
    let field;

    if (todo !== undefined) {
      field = { todo: todo };
    }

    if (completed !== undefined) {
      field = { completed: completed };
    }

    if (todo === undefined && completed === undefined) {
      res.status(400).send("No fields to update");
      return;
    }

    await modifyTodoItem(Number(todoId), field as TodoField);

    res.status(200).send(`${todoId} Todo 업데이트 성공`);
  } catch (err) {
    console.error(`${todoId} Todo 업데이트 실패`, err);
    res.status(500).send(`${todoId} Todo 업데이트 실패`);
    return;
  }
};

export const updateCompletedTodos = async (req: Request, res: Response) => {
  const { completed } = req.body;

  try {
    await modifyCompletedTodolist(completed);
    res.status(200).send("Completed Todos 업데이트 성공");
  } catch (err) {
    console.error("Completed Todos 업데이트 실패", err);
    res.status(500).send("Completed Todo 업데이트 실패");
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id;
    await deleteTodoItem(Number(todoId));

    res.json(`${todoId} Todo 삭제 성공`);
  } catch (err) {
    res.status(500).send("Todo 삭제 실패");
  }
};

export const deleteCompletedTodos = async (req: Request, res: Response) => {
  try {
    await deleteCompletedTodolist();

    res.json({ message: "Completed Todos 삭제 성공" });
  } catch (err) {
    res.status(500).send("Completed Todos 삭제 실패");
  }
};
