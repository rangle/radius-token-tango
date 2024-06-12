import { z } from "zod";

// Base schema
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tool: z.enum(["GitHub"]),
});

// Specialized Schema for GitHub
const githubSchema = z.object({
  repository: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
      "Invalid repository format (user/name)"
    ),
  accessToken: z.string().min(1, "Access token is required"),
  filePath: z
    .string()
    .regex(
      /^(?:[\w\-\s]+\/)*[\w\-\s]+\.[\w]+$/,
      "Invalid file path format (path/to/file.json)"
    )
    .min(1, "File path is required"),
  branch: z.string().default("main"),
  createNewFile: z.boolean().default(false),
});

// TODO: add support for other tools

// Extend base schema with tool-specific schema
export const formSchema = z.discriminatedUnion("tool", [
  baseSchema
    .extend({
      tool: z.literal("GitHub"),
    })
    .merge(githubSchema),
]);
