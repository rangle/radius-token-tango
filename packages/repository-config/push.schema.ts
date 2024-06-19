import { z } from "zod";

// Base schema
export const pushMessageSchema = z.object({
  branchName: z
    .string()
    .regex(/^(?:[\w\-\s\.]+\/)*[\w\-\.]+$/, "Invalid branch name format")
    .min(1, "Branch is required"),
  commitMessage: z.string().min(1, "Commit message is required"),
});
