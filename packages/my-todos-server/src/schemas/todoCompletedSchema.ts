import { z } from "zod";

export const todoCompletedSchema = z.object({
  completed: z.boolean(),
});
