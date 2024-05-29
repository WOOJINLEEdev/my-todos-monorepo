import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Schemas {
  params: z.ZodObject<any, any>;
  body: z.ZodObject<any, any>;
  query: z.ZodObject<any, any>;
}

export function validateData(schemas: Partial<Schemas>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { params, body, query } = schemas;

    try {
      if (params) {
        params.parse(req.params);
      }
      if (body) {
        body.parse(req.body);
      }
      if (query) {
        query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
