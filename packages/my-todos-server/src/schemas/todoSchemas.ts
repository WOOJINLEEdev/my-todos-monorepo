import { z } from "zod";

export const todoSchema = z
  .object({
    id: z.number(),
    todo: z.string(),
    completed: z.boolean(),
  })
  .partial();
