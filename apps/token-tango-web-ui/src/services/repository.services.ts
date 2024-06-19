import { WidgetConfiguration } from "@repo/config";
import { createGithubRepositoryClient } from "@repo/utils";

import { createLogger } from "@repo/utils";

const log = createLogger("WEB:Services:repository");

export const testRepositoryConnection = async (
  credentials: Pick<WidgetConfiguration, "repository" | "accessToken">
) => {
  const client = createGithubRepositoryClient({
    repoFullName: credentials.repository,
    accessToken: credentials.accessToken,
  });
  try {
    const branches = await client.getBranches();
    log("debug", "testRepositoryConnection", { branches });

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
    log("debug", "testFileExists", { file });
    return { status: "found", file } as const;
  } catch (error) {
    return { status: "error", error: (error as Error).message } as const;
  }
};

export const getBranchNames = async (
  credentials: Pick<
    WidgetConfiguration,
    "repository" | "accessToken" | "branch"
  >
) => {
  const client = createGithubRepositoryClient({
    repoFullName: credentials.repository,
    accessToken: credentials.accessToken,
  });

  const branches = await client.getBranches();
  log("debug", "testRepositoryConnection", { branches });
  return branches.map((b) => b.name);
};

export const testBranchAlreadyExists = (branches: string[], branch: string) => {
  const branchExists = branches.includes(branch);
  return { status: branchExists ? "exists" : "not-exists" } as const;
};
