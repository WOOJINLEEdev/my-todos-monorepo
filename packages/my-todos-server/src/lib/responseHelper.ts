import { Response } from "express";

export const successResponse = (
  res: Response,
  data?: any,
  message = "Success",
  statusCode = 200
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = "Something went wrong",
  statusCode = 500
) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export const validationErrorResponse = (
  res: Response,
  errors?: any,
  message = "Validation failed",
  statusCode = 400
) => {
  res.status(statusCode).json({
    status: "fail",
    message,
    errors,
  });
};
