import * as z from "zod";
import { formSchema } from "./repository.schema";
import { PersistenceStatus } from "@repo/utils";
export type RepositoryFormSchema = z.infer<typeof formSchema>;

export type WidgetConfiguration = RepositoryFormSchema & {
  status?: PersistenceStatus["state"];
  error?: string;
};

export type RepositoryConfigProps = {
  state: WidgetConfiguration;
  updateState: (newState: WidgetConfiguration) => void;
};
export type GithubConfig = Extract<RepositoryFormSchema, { tool: "GitHub" }>;
export type FileDownloadConfig = Extract<
  RepositoryFormSchema,
  { tool: "File Download" }
>;
export type RestServerConfig = Extract<
  RepositoryFormSchema,
  { tool: "REST Server" }
>;
export const isGithubConfig = (
  config: RepositoryFormSchema
): config is GithubConfig => config.tool === "GitHub";
export const isRestServerConfig = (
  config: RepositoryFormSchema
): config is RestServerConfig => config.tool === "REST Server";
