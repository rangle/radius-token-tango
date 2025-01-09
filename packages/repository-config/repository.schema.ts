import { z } from "zod";

// Base schema without tool
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// Specialized Schema for GitHub
const githubSchema = baseSchema.extend({
  tool: z.literal("GitHub"),
  repository: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
      "Invalid repository format (user/name)"
    ),
  accessToken: z
    .string()
    .regex(
      /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}|[a-f0-9]{40})$/,
      "Invalid token format. Must be a valid GitHub personal access token"
    ),
  filePath: z
    .string()
    .regex(
      /^(?:[\w\-\s\.]+\/)*[\w\-\.]+\.[\w]+$/,
      "Invalid file path format (path/to/file.json)"
    )
    .min(1, "File path is required"),
  branch: z.string().default("main"),
  createNewFile: z.boolean().default(false),
});

// Schema for File Download
const fileDownloadSchema = baseSchema.extend({
  tool: z.literal("File Download"),
});

// Schema for REST Server
const restServerSchema = baseSchema.extend({
  tool: z.literal("REST Server"),
  url: z.string().url("Invalid URL format"),
  headers: z
    .array(
      z.object({
        key: z.string().min(1, "Header key is required"),
        value: z.string().min(1, "Header value is required"),
      })
    )
    .default([]),
});

// Combine all schemas into a discriminated union
export const formSchema = z.discriminatedUnion("tool", [
  githubSchema,
  fileDownloadSchema,
  restServerSchema,
]);

export type FormSchema = z.infer<typeof formSchema>;
