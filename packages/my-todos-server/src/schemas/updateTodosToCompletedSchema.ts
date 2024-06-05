import { z } from "zod";

import { createTodoSchema } from "../schemas/createTodoSchema";

export const updateTodosToCompletedSchema = z.object({
  completed: createTodoSchema.shape.completed,
});
