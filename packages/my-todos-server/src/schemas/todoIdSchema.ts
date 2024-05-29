import { z } from "zod";

export const todoIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Invalid number" })
    .refine((val) => val > 0, { message: "ID must be a number" }),
});
