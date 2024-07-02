import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { validationErrorResponse } from "../lib/responseHelper";

interface CustomRequest extends Request {
  userId?: string;
}

export function authenticateToken() {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return validationErrorResponse(res, {
        message: "access token is not provided",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    try {
      const payload = (await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_KEY as string
      )) as JwtPayload;

      res.locals.userId = payload.userId;
      next();
    } catch (err) {
      console.error(err);
      return validationErrorResponse(res, {
        errors: err,
        message: "access token is not valid",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
  };
}
