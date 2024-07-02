import { Response } from "express";

export const successResponse = (
  res: Response,
  {
    data,
    message = "Success",
    statusCode = 200,
  }: { data?: any; message?: string; statusCode?: number }
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  {
    message = "Something went wrong",
    statusCode = 500,
  }: { message?: string; statusCode?: number }
) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export const validationErrorResponse = (
  res: Response,
  {
    errors,
    message = "Validation failed",
    statusCode = 400,
  }: { errors?: any; message: string; statusCode?: number }
) => {
  res.status(statusCode).json({
    status: "fail",
    message,
    errors,
  });
};
