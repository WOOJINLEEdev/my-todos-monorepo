import { z } from "zod";

export const authenticateGoogleUserSchema = z.object({
  code: z.string(),
});
