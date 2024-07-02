import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { errorResponse } from "../lib/responseHelper";
import HttpError from "../lib/HttpError";
import DatabaseError from "../lib/DatabaseError";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpError) {
    return errorResponse(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  } else if (error instanceof DatabaseError) {
    return errorResponse(res, {
      message: "Database error occurred",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  } else {
    return errorResponse(res, {
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export default errorMiddleware;
