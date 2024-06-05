import { z } from "zod";

import { todoIdSchema } from "./todoIdSchema";

export const createTodoSchema = z
  .object({
    id: todoIdSchema.shape.id,
    todo: z.string(),
    completed: z.boolean(),
  })
  .partial();
