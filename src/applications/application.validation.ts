// application.validation.ts
import { z } from "zod";

export const createApplicationSchema = z.object({
  userId: z.string().uuid(),
  jobId: z.string().uuid(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
