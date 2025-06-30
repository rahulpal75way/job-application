import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  postedById: z.string().uuid(), // Validate UUID
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
