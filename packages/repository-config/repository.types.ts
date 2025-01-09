import * as z from "zod";
import { formSchema } from "./repository.schema";
export type RepositoryFormSchema = z.infer<typeof formSchema>;

export type WidgetConfiguration = RepositoryFormSchema & {
  status?: "disconnected" | "error" | "online";
  error?: string;
};
