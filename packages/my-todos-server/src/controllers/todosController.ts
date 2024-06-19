import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { errorResponse, successResponse } from "../lib/responseHelper";
import HttpError from "../lib/HttpError";
import { todosService } from "../services/todosService";
import { Todo } from "../models/todosModel";

export const todosController = {
  createTodo: async (req: Request, res: Response) => {
    const { todo, completed } = req.body;
    const userId = res.locals.userId;

    const newTodo = await todosService.addTodoItem({
      todo: todo,
      completed: completed,
      userId: userId,
    });

    if (!newTodo) {
      throw new HttpError("Todo 추가 실패", StatusCodes.BAD_REQUEST);
    }

    successResponse(res, { data: newTodo });
  },

  getTodos: async (req: Request, res: Response) => {
    const filter = req.query?.filter || "all";
    const offset = req.query.offset;
    const limit = req.query.limit;
    const userId = res.locals.userId;

    const todos = await todosService.getTodos({
      filter: filter as string,
      limit: limit as string,
      offset: offset as string,
      userId: userId,
    });

    if (!todos) {
      throw new HttpError("Todo 찾기 실패", StatusCodes.NOT_FOUND);
    }

    successResponse(res, todos);
  },

  updateTodo: async (req: Request, res: Response) => {
    const todoId = parseInt(req.params.id, 10);
    const userId = res.locals.userId;

    const { todo, completed } = req.body;
    if (todo === undefined && completed === undefined) {
      errorResponse(res, "todo, completed both undefined");
      return;
    }

    if (todo && completed) {
      errorResponse(res, "todo, completed are not received at the same time");
      return;
    }

    let field: Partial<Todo> = {};

    if (todo !== undefined) {
      field = { todo: todo };
    }

    if (completed !== undefined) {
      field = { completed: completed };
    }

    const result = await todosService.updateTodoItem({
      id: todoId,
      field,
      userId,
    });

    if (!result) {
      throw new HttpError(
        `Todo 업데이트 실패, id: ${todoId}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    successResponse(res, {
      data: result,
    });
  },

  updateTodosToCompleted: async (req: Request, res: Response) => {
    const { completed } = req.body;
    const userId = res.locals.userId;

    const result = await todosService.updateTodosToCompleted({
      completed,
      userId,
    });

    if (!result) {
      throw new HttpError(
        "Completed Todo 업데이트 실패",
        StatusCodes.BAD_REQUEST
      );
    }

    successResponse(res, undefined, "Completed Todos 업데이트 성공");
  },

  deleteTodo: async (req: Request, res: Response) => {
    const todoId = parseInt(req.params.id, 10);
    const userId = res.locals.userId;

    const result = await todosService.deleteTodoItem({ id: todoId, userId });

    if (!result) {
      throw new HttpError(
        `Todo 삭제 실패, id: ${todoId}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    successResponse(res, undefined, `Todo 삭제 성공, id: ${todoId}`);
  },

  deleteCompletedTodos: async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const result = await todosService.deleteCompletedTodos(userId);

    if (!result) {
      throw new HttpError(
        "Completed Todos 삭제 실패",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    successResponse(res, undefined, "Completed Todos 삭제 성공");
  },
};
