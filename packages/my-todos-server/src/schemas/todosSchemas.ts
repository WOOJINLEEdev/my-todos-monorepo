import { z } from "zod";

export const todosSchema = z
  .object({
    id: z.number(),
    todo: z.string(),
    completed: z.boolean(),
  })
  .partial();
