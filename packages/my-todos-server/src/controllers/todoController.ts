import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { errorResponse, successResponse } from "../lib/responseHelper";
import { todoService } from "../services/todoService";
import { Todo } from "../models/todoModel";

export const todoController = {
  createTodo: async (req: Request, res: Response) => {
    const { todo, completed }: { todo: string; completed: boolean } = req.body;
    const userId = res.locals.userId;

    const newTodo = await todoService.addTodoItem({
      todo: todo,
      completed: completed,
      userId: userId,
    });

    if (!newTodo) {
      return errorResponse(res, {
        message: "Failed to add todo item",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    successResponse(res, { data: newTodo });
  },

  getTodos: async (req: Request, res: Response) => {
    const filter = req.query?.filter || "all";
    const offset = req.query.offset;
    const limit = req.query.limit;
    const userId = res.locals.userId;

    const todos = await todoService.getTodos({
      filter: filter as string,
      limit: limit as string,
      offset: offset as string,
      userId: userId,
    });

    successResponse(res, { data: todos });
  },

  updateTodo: async (req: Request, res: Response) => {
    const todoId = parseInt(req.params.id, 10);
    const userId = res.locals.userId;

    const { todo, completed } = req.body;

    if (todo === undefined && completed === undefined) {
      return errorResponse(res, { message: "todo, completed both undefined" });
    }

    if (todo && completed) {
      return errorResponse(res, {
        message: "todo, completed are not received at the same time",
      });
    }

    let field: Partial<Todo> = {};

    if (todo !== undefined) {
      field = { todo: todo };
    }

    if (completed !== undefined) {
      field = { completed: completed };
    }

    const result = await todoService.updateTodoItem({
      id: todoId,
      field,
      userId,
    });

    if (!result) {
      return errorResponse(res, {
        message: `Failed to update todo item, id: ${todoId}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    successResponse(res, {
      data: result,
    });
  },

  updateTodosToCompleted: async (req: Request, res: Response) => {
    const { completed } = req.body;
    const userId = res.locals.userId;

    const result = await todoService.updateTodosToCompleted({
      completed,
      userId,
    });

    if (!result) {
      return errorResponse(res, {
        message: "Failed to update completed todo item",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    successResponse(res, { message: "Completed Todos 업데이트 성공" });
  },

  deleteTodo: async (req: Request, res: Response) => {
    const todoId = parseInt(req.params.id, 10);
    const userId = res.locals.userId;

    const result = await todoService.deleteTodoItem({ id: todoId, userId });

    if (!result) {
      return errorResponse(res, {
        message: `Failed to delete todo item`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    successResponse(res, { message: `Todo 삭제 성공, id: ${todoId}` });
  },

  deleteCompletedTodos: async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const result = await todoService.deleteCompletedTodos(userId);

    if (!result) {
      return errorResponse(res, {
        message: `Failed to delete completed todos`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    successResponse(res, { message: "Completed Todos 삭제 성공" });
  },
};
