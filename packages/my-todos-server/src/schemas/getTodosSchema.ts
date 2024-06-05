import { z } from "zod";

export const getTodosSchema = z.object({
  filter: z.string(),
  limit: z.string(),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Invalid number" }),
});
