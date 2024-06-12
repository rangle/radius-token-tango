import * as z from "zod";
import { formSchema } from "./repository.schema";
export type FormSchema = z.infer<typeof formSchema>;

export type WidgetConfiguration = FormSchema & {
  status?: "disconnected" | "error" | "online";
  error?: string;
};
