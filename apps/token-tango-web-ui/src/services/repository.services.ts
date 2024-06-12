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

export const testFileExists = async (
  credentials: Pick<
    WidgetConfiguration,
    "repository" | "accessToken" | "branch" | "filePath"
  >
) => {
  const client = createGithubRepositoryClient({
    repoFullName: credentials.repository,
    accessToken: credentials.accessToken,
  });
  try {
    const { filePath, branch } = credentials;
    const file = await client.getFileDetailsByPath(filePath, branch);
    console.log("file", file);
    return { status: "found", file } as const;
  } catch (error) {
    return { status: "error", error: (error as Error).message } as const;
  }
};
