import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { todosService } from "../services/todosService";
import { Todo } from "../models/todosModel";
import { errorResponse, successResponse } from "../lib/responseHelper";
import HttpError from "../lib/HttpError";

export const todosController = {
  createTodo: async (req: Request, res: Response) => {
    const newTodo = await todosService.addTodoItem(req.body);

    if (!newTodo) {
      throw new HttpError("Todo 추가 실패", StatusCodes.BAD_REQUEST);
    }

    successResponse(res, { data: newTodo });
  },

  getTodos: async (req: Request, res: Response) => {
    const filter = req.query?.filter || "all";

    const todos = await todosService.getTodos(filter as string);

    if (!todos) {
      throw new HttpError("Todo 찾기 실패", StatusCodes.NOT_FOUND);
    }

    successResponse(res, {
      data: todos?.todos,
      metadata: { remain: todos?.remain, total: todos?.total },
    });
  },

  updateTodo: async (req: Request, res: Response) => {
    const todoId = parseInt(req.params.id, 10);

    // if (isNaN(todoId)) {
    //   throw new HttpError(
    //     "유효하지 않은 id, id는 숫자만 가능",
    //     StatusCodes.BAD_REQUEST
    //   );
    // }

    const { todo, completed } = req.body;
    if (todo === undefined && completed === undefined) {
      errorResponse(res, "todo, completed both undefined");
      return;
    }

    if (todo && completed) {
      errorResponse(res, "todo, completed both ");
      return;
    }

    let field: Partial<Todo> = {};

    if (todo !== undefined) {
      field = { todo: todo };
    }

    if (completed !== undefined) {
      field = { completed: completed };
    }

    const result = await todosService.updateTodoItem(todoId, field);

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

    // if (typeof completed !== "boolean") {
    //   throw new HttpError("유효하지 않은 completed", StatusCodes.BAD_REQUEST);
    // }

    const result = await todosService.updateTodosToCompleted(completed);

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

    // if (isNaN(todoId)) {
    //   throw new HttpError(
    //     "유효하지 않은 id, id는 숫자만 가능",
    //     StatusCodes.BAD_REQUEST
    //   );
    // }

    const result = await todosService.deleteTodoItem(todoId);

    if (!result) {
      throw new HttpError(
        `Todo 삭제 실패, id: ${todoId}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    successResponse(res, undefined, `Todo 삭제 성공, id: ${todoId}`);
  },

  deleteCompletedTodos: async (req: Request, res: Response) => {
    const result = await todosService.deleteCompletedTodos();

    if (!result) {
      throw new HttpError(
        "Completed Todos 삭제 실패",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    successResponse(res, undefined, "Completed Todos 삭제 성공");
  },
};