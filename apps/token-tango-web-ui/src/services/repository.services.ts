import { WidgetConfiguration } from "@repo/config";
import { createGithubRepositoryClient } from "@repo/utils";

export const testRepositoryConnection = async (
  credentials: Pick<WidgetConfiguration, "repository" | "accessToken">
) => {
  const client = createGithubRepositoryClient({
    repoFullName: credentials.repository,
    accessToken: credentials.accessToken,
  });
  try {
    const branches = await client.getBranches();
    return { status: "online", branches } as const;
  } catch (error) {
    return { status: "error", error: (error as Error).message } as const;
  }
};
